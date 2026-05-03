import { PrefillDataSource, PrefillOption, PrefillContext } from './types';
import { globalDataSource } from './globalDataSource';
import {
  directDependencyDataSource,
  transitiveDependencyDataSource,
} from './formDependencyDataSource';

/**
 * Data source registry manages all available prefill data sources.
 * New data sources can be added by registering them with the registry.
 * This design allows for easy extension without modifying core UI logic.
 */
class DataSourceRegistry {
  private sources: Map<string, PrefillDataSource> = new Map();

  register(source: PrefillDataSource): void {
    this.sources.set(source.id, source);
  }

  unregister(sourceId: string): void {
    this.sources.delete(sourceId);
  }

  getSource(sourceId: string): PrefillDataSource | undefined {
    return this.sources.get(sourceId);
  }

  getAllSources(): PrefillDataSource[] {
    return Array.from(this.sources.values());
  }

  /**
   * Gets all available prefill options from all registered sources.
   * Returns options grouped by source for organized display.
   */
  getGroupedOptions(context: PrefillContext): Map<string, { label: string; options: PrefillOption[] }> {
    const grouped = new Map<string, { label: string; options: PrefillOption[] }>();

    for (const source of this.sources.values()) {
      const options = source.getItems(context);
      if (options.length > 0) {
        grouped.set(source.id, {
          label: source.label,
          options,
        });
      }
    }

    return grouped;
  }

  /**
   * Gets all available prefill options as a flat list.
   */
  getAllOptions(context: PrefillContext): PrefillOption[] {
    const allOptions: PrefillOption[] = [];

    for (const source of this.sources.values()) {
      allOptions.push(...source.getItems(context));
    }

    return allOptions;
  }
}

// Create and configure the default registry
export const dataSourceRegistry = new DataSourceRegistry();

// Register default data sources
dataSourceRegistry.register(globalDataSource);
dataSourceRegistry.register(directDependencyDataSource);
dataSourceRegistry.register(transitiveDependencyDataSource);

export { DataSourceRegistry };
