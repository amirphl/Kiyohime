import React, { useCallback, useRef, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { apiService } from '../../../services/api';
import { PlatformSettingsItem } from '../../../types/platformSettings';
import MediaPreviewCell from './MediaPreviewCell';

interface PlatformSettingsTableProps {
  items: PlatformSettingsItem[];
  accessToken: string | null;
  onEdit: (item: PlatformSettingsItem) => void;
  onError: (message: string) => void;
  labels: {
    id: string;
    name: string;
    description: string;
    website: string;
    multimediaPreview: string;
    download: string;
    downloading: string;
    downloadFailed: string;
    businessLicense: string;
    status: string;
    actions: string;
    edit: string;
    empty: string;
    statusInitialized: string;
    statusInProgress: string;
    statusActive: string;
    statusInactive: string;
  };
}

const PlatformSettingsTable: React.FC<PlatformSettingsTableProps> = ({
  items,
  accessToken,
  onEdit,
  onError,
  labels,
}) => {
  const [downloadLoadingByUuid, setDownloadLoadingByUuid] = useState<
    Record<string, boolean>
  >({});
  const downloadInFlight = useRef<Set<string>>(new Set());

  const handleDownload = useCallback(
    async (uuid?: string) => {
      if (!uuid) return;
      if (!accessToken) {
        onError(labels.downloadFailed);
        return;
      }
      if (downloadInFlight.current.has(uuid)) return;

      downloadInFlight.current.add(uuid);
      setDownloadLoadingByUuid(prev => ({ ...prev, [uuid]: true }));

      try {
        apiService.setAccessToken(accessToken);
        const res = await apiService.downloadMultimedia(uuid);
        if (!res.success || !res.blob) {
          onError(res.message || labels.downloadFailed);
          return;
        }

        const url = URL.createObjectURL(res.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = res.filename || 'multimedia';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } catch (error) {
        onError(
          error instanceof Error && error.message
            ? error.message
            : labels.downloadFailed
        );
      } finally {
        downloadInFlight.current.delete(uuid);
        setDownloadLoadingByUuid(prev => ({ ...prev, [uuid]: false }));
      }
    },
    [accessToken, labels.downloadFailed, onError]
  );

  const statusLabel = (status: PlatformSettingsItem['status']) => {
    switch (status) {
      case 'initialized':
        return labels.statusInitialized;
      case 'in-progress':
        return labels.statusInProgress;
      case 'active':
        return labels.statusActive;
      case 'inactive':
        return labels.statusInactive;
      default:
        return status;
    }
  };

  if (!items.length) {
    return (
      <div className='text-sm text-gray-600 bg-white border border-gray-200 rounded-lg p-6'>
        {labels.empty}
      </div>
    );
  }

  return (
    <div className='overflow-x-auto bg-white border border-gray-200 rounded-lg'>
      <table className='min-w-full divide-y divide-gray-200 text-sm'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider'>
              {labels.id}
            </th>
            <th className='px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider'>
              {labels.name}
            </th>
            <th className='px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider'>
              {labels.description}
            </th>
            <th className='px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider'>
              {labels.website}
            </th>
            <th className='px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider'>
              {labels.multimediaPreview}
            </th>
            <th className='px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider'>
              {labels.download}
            </th>
            <th className='px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider'>
              {labels.businessLicense}
            </th>
            <th className='px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider'>
              {labels.status}
            </th>
            <th className='px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider'>
              {labels.actions}
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200'>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td className='px-4 py-3 text-gray-700 text-center'>
                {index + 1}
              </td>
              <td className='px-4 py-3 text-gray-700 text-center'>
                {item.name || '—'}
              </td>
              <td className='px-4 py-3 text-gray-700 text-center max-w-md'>
                <div className='line-clamp-2'>{item.description || '—'}</div>
              </td>
              <td className='px-4 py-3 text-center text-sm'>
                {item.website ? (
                  <a
                    href={item.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 underline break-all'
                  >
                    {item.website}
                  </a>
                ) : (
                  '—'
                )}
              </td>
              <td className='px-4 py-3 text-center'>
                <MediaPreviewCell
                  uuid={item.multimedia_uuid}
                  accessToken={accessToken}
                  onError={onError}
                />
              </td>
              <td className='px-4 py-3 text-center'>
                {item.multimedia_uuid &&
                downloadLoadingByUuid[item.multimedia_uuid] ? (
                  <Button
                    variant='outline'
                    size='sm'
                    disabled
                    className='min-w-0 px-2'
                  >
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <span className='sr-only'>{labels.downloading}</span>
                  </Button>
                ) : (
                  <Button
                    variant='outline'
                    size='sm'
                    className='min-w-0 px-2'
                    disabled={
                      !item.multimedia_uuid ||
                      !!(
                        item.multimedia_uuid &&
                        downloadLoadingByUuid[item.multimedia_uuid]
                      )
                    }
                    onClick={() => handleDownload(item.multimedia_uuid)}
                  >
                    <Download className='h-4 w-4' />
                    <span className='sr-only'>{labels.download}</span>
                  </Button>
                )}
              </td>
              <td className='px-4 py-3 text-center'>
                {item.business_license_uuid &&
                downloadLoadingByUuid[item.business_license_uuid] ? (
                  <Button
                    variant='outline'
                    size='sm'
                    disabled
                    className='min-w-0 px-2'
                  >
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <span className='sr-only'>{labels.downloading}</span>
                  </Button>
                ) : (
                  <Button
                    variant='outline'
                    size='sm'
                    className='min-w-0 px-2'
                    disabled={
                      !item.business_license_uuid ||
                      !!(
                        item.business_license_uuid &&
                        downloadLoadingByUuid[item.business_license_uuid]
                      )
                    }
                    onClick={() => handleDownload(item.business_license_uuid)}
                  >
                    <Download className='h-4 w-4' />
                    <span className='sr-only'>{labels.businessLicense}</span>
                  </Button>
                )}
              </td>
              <td className='px-4 py-3 text-gray-700 text-center'>
                {statusLabel(item.status)}
              </td>
              <td className='px-4 py-3 text-center'>
                <Button
                  variant='outline'
                  size='sm'
                  className='min-w-0 px-2'
                  onClick={() => onEdit(item)}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='h-4 w-4'
                    aria-hidden='true'
                  >
                    <path d='M12 20h9' />
                    <path d='m16.5 3.5 4 4L7 21l-4 1 1-4Z' />
                  </svg>
                  <span className='sr-only'>{labels.edit}</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlatformSettingsTable;
