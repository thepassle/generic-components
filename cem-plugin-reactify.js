/* eslint-disable */

import fs from 'fs';
import path from 'path';
import prettier from 'prettier';

const packageJsonPath = `${process.cwd()}${path.sep}package.json`;
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());

function getDefineCallForElement(cem, tagName) {
  let result = undefined;

  cem?.modules?.forEach(_module => {
    _module?.exports?.forEach(ex => {
      if (ex.kind === 'custom-element-definition' && ex.name === tagName) result = _module.path;
    });
  });

  return result;
}

function camelize(str) {
  const arr = str.split('-');
  const capital = arr.map((item, index) =>
    index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item.toLowerCase(),
  );
  return capital.join('');
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const has = arr => Array.isArray(arr) && arr.length > 0;

const RESERVED_WORDS = [
  'children',
  'localName',
  'ref',
  'style',
  'className',
  'abstract',
  'arguments',
  'await',
  'boolean',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'double',
  'else',
  'enum',
  'eval',
  'export',
  'extends',
  'false',
  'final',
  'finally',
  'float',
  'for',
  'function',
  'goto',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'int',
  'interface',
  'let',
  'long',
  'native',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'short',
  'static',
  'super',
  'switch',
  'synchronized',
  'this',
  'throw',
  'throws',
  'transient',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'volatile',
  'while',
  'with',
  'yield',
];

/**
 * ATTRIBUTE/PROPERTY NAME CLASHES:
 * It could be the case that an attr/property are not correctly linked together (e.g.: the attr does not have a `fieldName` pointing
 * to the property). In that case, there will be two props passed to the React component function with the same name, which will break things
 * Make sure to document components correctly (in most cases, all you have to do is add an @attr jsdoc to the field)
 *
 * Attrs and properties are distinguished by an attr's `fieldName`. If an attr has a `fieldName`, we ignore it as being an attribute, and
 * only use the property (which is whatever the `fieldName` points to). If an attr does not have a `fieldName`, we apply it as an attr
 *
 * EVENTS:
 * `'selected-changed'` event expects a function passed as `onSelectedChanged` (we add the 'on', and we camelize and capitalize the event name)
 */

export default function reactify({ exclude = [], attributeMapping = {}, outdir = 'legacy' }) {
  return {
    name: 'reactify',
    packageLinkPhase({ customElementsManifest }) {
      if (!fs.existsSync(outdir)) {
        fs.mkdirSync(outdir);
      }

      const components = [];
      customElementsManifest.modules.forEach(mod => {
        mod.declarations.forEach(dec => {
          if (!exclude.includes(dec.name) && (dec.customElement || dec.tagName)) {
            components.push(dec);
          }
        });
      });

      components.forEach(component => {
        let useEffect = false;
        const fields = component?.members?.filter(
          member =>
            member.kind === 'field' &&
            !member.static &&
            member.privacy !== 'private' &&
            member.privacy !== 'protected',
        );

        const booleanAttributes = [];
        const attributes = [];

        component?.attributes
          ?.filter(attr => !attr.fieldName)
          ?.forEach(attr => {
            /** Handle reserved keyword attributes */
            if (RESERVED_WORDS.includes(attr?.name)) {
              /** If we have a user-specified mapping, rename */
              if (attr.name in attributeMapping) {
                const attribute = {
                  ...attr,
                  originalName: attr.name,
                  name: attributeMapping[attr.name],
                };
                if (attr?.type?.text === 'boolean') {
                  booleanAttributes.push(attribute);
                } else {
                  attributes.push(attribute);
                }
                return;
              }
              throw new Error(
                `Attribute \`${attr.name}\` in custom element \`${component.name}\` is a reserved keyword and cannot be used. Please provide an \`attributeMapping\` in the plugin options to rename the JavaScript variable that gets passed to the attribute.`,
              );
            }

            if (attr?.type?.text === 'boolean') {
              booleanAttributes.push(attr);
            } else {
              attributes.push(attr);
            }
          });

        let params = [];
        component?.events?.forEach(event => {
          params.push(`on${capitalizeFirstLetter(camelize(event.name))}`);
        });

        fields?.forEach(member => {
          params.push(member.name);
        });

        [...(booleanAttributes || []), ...(attributes || [])]?.forEach(attr => {
          params.push(camelize(attr.name));
        });

        params = params?.join(', ');

        const createEventName = event => `on${capitalizeFirstLetter(camelize(event.name))}`;

        const events = component?.events?.map(
          event => `
            useEffect(() => {
              if(${createEventName(event)} !== undefined) {
                ref.current.addEventListener('${event.name}', ${createEventName(event)});
              }
            }, [])
`,
        );

        const booleanAttrs = booleanAttributes?.map(
          attr => `
            useEffect(() => {
              if(${attr?.name ?? attr.originalName} !== undefined) {
                if(${attr?.name ?? attr.originalName}) {
                  ref.current.setAttribute('${attr.name}', '');
                } else {
                  ref.current.removeAttribute('${attr.name}');
                }
              }
            }, [${attr?.originalName ?? attr.name}])
`,
        );

        const attrs = attributes?.map(
          attr => `
            useEffect(() => {
              if(${attr?.name ??
                attr.originalName} !== undefined && ref.current.getAttribute('${attr?.originalName ??
            attr.name}') !== String(${attr?.name ?? attr.originalName})) {
                ref.current.setAttribute('${attr?.originalName ?? attr.name}', ${attr?.name ??
            attr.originalName})
              }
            }, [${attr?.name ?? attr.originalName}])
        `,
        );

        const props = fields?.map(
          member => `
            useEffect(() => {
              if(${member.name} !== undefined && ref.current.${member.name} !== ${member.name}) {
                ref.current.${member.name} = ${member.name};
              }
            }, [${member.name}])
        `,
        );

        if (has(events) || has(props) || has(attrs) || has(booleanAttrs)) {
          useEffect = true;
        }

        const moduleSpecifier = path.join(
          packageJson.name,
          getDefineCallForElement(customElementsManifest, component.tagName),
        );

        const result = `
          import React${useEffect ? ', {useEffect, useRef}' : ''} from "react";
          import '${moduleSpecifier}';

          export function ${component.name}({children${params ? ',' : ''} ${params}}) {
            ${useEffect ? `const ref = useRef(null);` : ''}

            ${has(events) ? '/** Event listeners - run once */' : ''}
            ${events?.join('') || ''}
            ${
              has(booleanAttrs)
                ? '/** Boolean attributes - run whenever an attr has changed */'
                : ''
            }
            ${booleanAttrs?.join('') || ''}
            ${has(attrs) ? '/** Attributes - run whenever an attr has changed */' : ''}
            ${attrs?.join('') || ''}
            ${has(props) ? '/** Properties - run whenever a property has changed */' : ''}
            ${props?.join('') || ''}

            return (
              <${component.tagName} ${useEffect ? 'ref={ref}' : ''} ${[
          ...booleanAttributes,
          ...attributes,
        ]
          .map(attr => `${attr?.originalName ?? attr.name}={${attr?.name ?? attr.originalName}}`)
          .join(' ')}>
                {children}
              </${component.tagName}>
            )
          }
        `;

        fs.writeFileSync(
          path.join(outdir, `${component.name}.jsx`),
          prettier.format(result, { parser: 'babel' }),
        );
      });
    },
  };
}
