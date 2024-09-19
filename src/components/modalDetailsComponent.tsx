import { GradeModel } from '@/models/gradeModel';
import { StorageService } from '@/services/storageService';
import { getGradeAsync } from '@/services/userService';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useSWR from 'swr';

interface ModalDetailsProps {
  classCode: string;
  className: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export default function ModalDetailsComponent({ classCode, className, showModal, setShowModal }: ModalDetailsProps) {
  const hash = StorageService.getHash();
  const {
    data: swrResponse,
    isLoading,
    isValidating,
  } = useSWR(`/api/grade/${classCode}`, () => getGradeAsync(hash, classCode));

  return (
    <div>
      <Dialog header={className} visible={showModal} onHide={() => setShowModal(false)} draggable={false}>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <DataTable
            value={swrResponse && swrResponse.data.data?.length > 0 ? swrResponse?.data.data[0].grade : []}
            emptyMessage="Nenhum resultado encontrado."
            loading={isValidating}
            stripedRows
            size="small">
            <Column field="0" header="Avaliação"></Column>
            <Column field="1" header="Data de Lançamento"></Column>
            <Column field="2" header="Nota"></Column>
          </DataTable>
        )}
      </Dialog>
    </div>
  );
}
