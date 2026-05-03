import { PrefillDataSource, PrefillOption, PrefillContext } from './types';

/**
 * Global data source provides system-level data that is available
 * regardless of form dependencies. This includes action metadata,
 * client information, and other global context.
 */

interface GlobalDataItem {
  key: string;
  label: string;
  category: string;
}

// Static global data items available in the system
const GLOBAL_DATA_ITEMS: GlobalDataItem[] = [
  { key: 'action.id', label: 'Action ID', category: 'Action' },
  { key: 'action.created_at', label: 'Created At', category: 'Action' },
  { key: 'action.updated_at', label: 'Updated At', category: 'Action' },
  { key: 'action.status', label: 'Status', category: 'Action' },
  { key: 'client.id', label: 'Client ID', category: 'Client' },
  { key: 'client.name', label: 'Client Name', category: 'Client' },
  { key: 'client.email', label: 'Client Email', category: 'Client' },
  { key: 'user.id', label: 'User ID', category: 'User' },
  { key: 'user.name', label: 'User Name', category: 'User' },
  { key: 'user.email', label: 'User Email', category: 'User' },
];

export const globalDataSource: PrefillDataSource = {
  id: 'global',
  label: 'Global Data',
  
  getItems(_context: PrefillContext): PrefillOption[] {
    return GLOBAL_DATA_ITEMS.map(item => ({
      id: `global:${item.key}`,
      label: item.label,
      sourceLabel: `Global / ${item.category}`,
      sourceType: 'global',
      sourceId: 'global',
      fieldKey: item.key,
      displayPath: item.key,
      metadata: { category: item.category },
    }));
  },
};
