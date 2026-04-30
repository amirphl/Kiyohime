import React from 'react';
import { AdminPlatformSettingsItem } from '../../../types/admin';
import { AdminPlatformSettingsCopy } from '../translations';
import { PlatformMetadataKey } from '../useAdminPlatformSettingsMetadata';

interface PlatformSettingsTableProps {
  items: AdminPlatformSettingsItem[];
  loading: boolean;
  error: string | null;
  copy: AdminPlatformSettingsCopy;
  onOpenStatusModal: (item: AdminPlatformSettingsItem) => void;
  previewsByUuid: Record<string, string | null | undefined>;
  previewLoadingByUuid: Record<string, boolean>;
  downloadLoadingByUuid: Record<string, boolean>;
  onDownloadMultimedia: (uuid?: string | null) => void;
  onOpenMetadataModal: (item: AdminPlatformSettingsItem) => void;
  metadataLoadingById: Record<number, boolean>;
  metadataKeyOptions: PlatformMetadataKey[];
  getMetadataForm: (id: number) => { key: PlatformMetadataKey; value: string };
  onMetadataKeyChange: (id: number, key: PlatformMetadataKey) => void;
  onMetadataValueChange: (id: number, value: string) => void;
  onAttachMetadata: (id: number) => void;
  statusLabel: (status: string) => string;
  formatDateTime: (value?: string | null) => string;
}

const PlatformSettingsTable: React.FC<PlatformSettingsTableProps> = ({
  items,
  loading,
  error,
  copy,
  onOpenStatusModal,
  previewsByUuid,
  previewLoadingByUuid,
  downloadLoadingByUuid,
  onDownloadMultimedia,
  onOpenMetadataModal,
  metadataLoadingById,
  metadataKeyOptions,
  getMetadataForm,
  onMetadataKeyChange,
  onMetadataValueChange,
  onAttachMetadata,
  statusLabel,
  formatDateTime,
}) => {
  return (
    <div className='overflow-auto rounded-lg border bg-white'>
      <table className='min-w-full text-sm'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='border px-2 py-2'>{copy.table.row}</th>
            <th className='border px-2 py-2'>{copy.table.id}</th>
            <th className='border px-2 py-2'>{copy.table.uuid}</th>
            <th className='border px-2 py-2'>{copy.table.customerId}</th>
            <th className='border px-2 py-2'>{copy.table.platform}</th>
            <th className='border px-2 py-2'>{copy.table.name}</th>
            <th className='border px-2 py-2'>{copy.table.description}</th>
            <th className='border px-2 py-2'>{copy.table.multimediaUuid}</th>
            <th className='border px-2 py-2'>{copy.table.preview}</th>
            <th className='border px-2 py-2'>{copy.table.download}</th>
            <th className='border px-2 py-2'>{copy.table.metadataInfo}</th>
            <th className='border px-2 py-2'>{copy.table.metadata}</th>
            <th className='border px-2 py-2'>{copy.table.status}</th>
            <th className='border px-2 py-2'>{copy.table.createdAt}</th>
            <th className='border px-2 py-2'>{copy.table.updatedAt}</th>
            <th className='border px-2 py-2'>{copy.table.changeStatus}</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={16} className='border px-2 py-6 text-center'>
                {copy.common.loading}
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={16} className='border px-2 py-6 text-center text-red-600'>
                {error}
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={16} className='border px-2 py-6 text-center'>
                {copy.table.noData}
              </td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr key={item.id} className='odd:bg-white even:bg-gray-50'>
                <td className='border px-2 py-2 text-center'>{index + 1}</td>
                <td className='border px-2 py-2 text-center'>{item.id}</td>
                <td className='border px-2 py-2 font-mono text-xs'>{item.uuid}</td>
                <td className='border px-2 py-2 text-center'>{item.customer_id}</td>
                <td className='border px-2 py-2'>{item.platform || copy.common.emptyValue}</td>
                <td className='border px-2 py-2'>{item.name || copy.common.emptyValue}</td>
                <td className='border px-2 py-2'>{item.description || copy.common.emptyValue}</td>
                <td className='border px-2 py-2 font-mono text-xs'>
                  {item.multimedia_uuid || copy.common.emptyValue}
                </td>
                <td className='border px-2 py-2 text-center'>
                  {!item.multimedia_uuid ? (
                    <span className='text-xs text-gray-500'>{copy.common.emptyValue}</span>
                  ) : previewLoadingByUuid[item.multimedia_uuid] ? (
                    <span className='text-xs text-gray-500'>{copy.common.loading}</span>
                  ) : previewsByUuid[item.multimedia_uuid] ? (
                    <img
                      src={previewsByUuid[item.multimedia_uuid] || ''}
                      alt={copy.table.preview}
                      className='mx-auto h-10 w-16 rounded border border-gray-200 object-cover'
                    />
                  ) : (
                    <span className='text-xs text-gray-500'>{copy.common.emptyValue}</span>
                  )}
                </td>
                <td className='border px-2 py-2 text-center'>
                  <button
                    type='button'
                    onClick={() => onDownloadMultimedia(item.multimedia_uuid)}
                    disabled={!item.multimedia_uuid || !!downloadLoadingByUuid[item.multimedia_uuid]}
                    className='rounded border px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    {item.multimedia_uuid && downloadLoadingByUuid[item.multimedia_uuid]
                      ? copy.common.loading
                      : copy.actions.download}
                  </button>
                </td>
                <td className='border px-2 py-2 text-center'>
                  <button
                    type='button'
                    onClick={() => onOpenMetadataModal(item)}
                    className='rounded border px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50'
                    title={copy.actions.viewMetadata}
                  >
                    ?
                  </button>
                </td>
                <td className='border px-2 py-2'>
                  <div className='flex min-w-[260px] items-center gap-1'>
                    <select
                      value={getMetadataForm(item.id).key}
                      onChange={(e) =>
                        onMetadataKeyChange(
                          item.id,
                          e.target.value as PlatformMetadataKey
                        )
                      }
                      className='rounded border px-2 py-1 text-xs'
                    >
                      {metadataKeyOptions.map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                    <input
                      value={getMetadataForm(item.id).value}
                      onChange={(e) => onMetadataValueChange(item.id, e.target.value)}
                      placeholder={copy.table.metadataValue}
                      className='w-full rounded border px-2 py-1 text-xs'
                    />
                    <button
                      type='button'
                      onClick={() => onAttachMetadata(item.id)}
                      disabled={!!metadataLoadingById[item.id]}
                      className='rounded border px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60'
                      title={copy.actions.attachMetadata}
                    >
                      {metadataLoadingById[item.id]
                        ? copy.common.loading
                        : copy.actions.attachMetadata}
                    </button>
                  </div>
                </td>
                <td className='border px-2 py-2'>{statusLabel(item.status)}</td>
                <td className='border px-2 py-2'>{formatDateTime(item.created_at)}</td>
                <td className='border px-2 py-2'>{formatDateTime(item.updated_at)}</td>
                <td className='border px-2 py-2 text-center'>
                  <button
                    type='button'
                    onClick={() => onOpenStatusModal(item)}
                    className='rounded border px-2 py-1 text-xs text-gray-700 hover:bg-gray-50'
                  >
                    {copy.actions.openStatusModal}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PlatformSettingsTable;
