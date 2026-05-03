import { PrefillDataSource, PrefillOption, PrefillContext } from './types';
import { FormNode } from '../types/journey';

/**
 * Creates prefill options from a list of form nodes.
 * Each field in each form becomes a selectable option.
 */
function createOptionsFromForms(
  forms: FormNode[],
  dependencyType: 'direct' | 'transitive'
): PrefillOption[] {
  const options: PrefillOption[] = [];
  
  for (const form of forms) {
    for (const field of form.fields) {
      options.push({
        id: `${form.id}:${field.key}`,
        label: field.label,
        sourceLabel: form.name,
        sourceType: 'form',
        sourceId: form.id,
        fieldKey: field.key,
        displayPath: `${form.name}.${field.key}`,
        metadata: {
          dependencyType,
          fieldType: field.type,
          required: field.required,
        },
      });
    }
  }
  
  return options;
}

/**
 * Direct dependency data source provides fields from forms that
 * the selected form directly depends on (immediate upstream forms).
 */
export const directDependencyDataSource: PrefillDataSource = {
  id: 'direct-dependencies',
  label: 'Direct Dependencies',
  
  getItems(context: PrefillContext): PrefillOption[] {
    return createOptionsFromForms(context.directDependencies, 'direct');
  },
};

/**
 * Transitive dependency data source provides fields from forms that
 * the selected form transitively depends on (all upstream forms
 * beyond direct dependencies).
 */
export const transitiveDependencyDataSource: PrefillDataSource = {
  id: 'transitive-dependencies',
  label: 'Transitive Dependencies',
  
  getItems(context: PrefillContext): PrefillOption[] {
    return createOptionsFromForms(context.transitiveDependencies, 'transitive');
  },
};
