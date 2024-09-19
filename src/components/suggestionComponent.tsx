'use client';
import { ResponseModel } from '@/models/ResponseModel';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';

export default function SuggestionComponent({ username }: { username: string | null }) {
  const toast = useRef<Toast>(null);

  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  async function onSendSuggestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (sending || !suggestion) return;

    setSending(true);

    const response = await axios.post<ResponseModel<any>>('api/suggestion', { username, suggestion });

    if (response.data.success) {
      if (toast && toast.current) {
        toast.current.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Sugestão enviada com sucesso!',
        });
      } else {
        if (toast && toast.current) {
          toast.current.show({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao enviar!',
          });
        }
      }

      setShowModal(false);
      setSuggestion('');
      setSending(false);
    }
  }

  return (
    <div className="mb-2">
      <Toast ref={toast} position="top-center" />
      {username && (
        <span onClick={() => setShowModal(true)} style={{ fontSize: 12 }}>
          Sugestão?
        </span>
      )}
      <Dialog header="Sugestão de melhoria" visible={showModal} onHide={() => setShowModal(false)} draggable={false}>
        <form className="d-flex flex-column" onSubmit={onSendSuggestion}>
          <InputTextarea
            placeholder="Descreva sua sugestão"
            rows={5}
            cols={30}
            onChange={(e) => setSuggestion(e.target.value)}
            value={suggestion}
          />
          <Button
            type="submit"
            label="Enviar"
            size="small"
            icon="pi pi-check"
            className="align-self-end mt-2"
            disabled={sending}
            loading={sending}
          />
        </form>
      </Dialog>
    </div>
  );
}
