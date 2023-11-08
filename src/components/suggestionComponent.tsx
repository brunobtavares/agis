'use client'
import { Api } from "@/axios/client";
import { useUserContext } from "@/contexts/userContext";
import { ResponseModel } from "@/models/ResponseModel";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";

export default function SuggestionComponent() {
    const toast = useRef<Toast>(null);

    const { user } = useUserContext();

    const [showModal, setShowModal] = useState(false);
    const [sending, setSending] = useState(false);
    const [suggestion, setSuggestion] = useState('');

    function onSendSuggestion(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (sending || !suggestion) return;

        setSending(true);

        Api.post<ResponseModel<any>>('/suggestion', {
            'username': user?.name,
            'suggestion': suggestion
        })
            .then((response) => {
                const data = response.data;
                if (data.success) {
                    if (toast && toast.current) { toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Sugestão enviada com sucesso!' }); }
                }
            })
            .catch(() => {
                if (toast && toast.current) { toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao enviar!' }); }
            })
            .finally(() => {
                setShowModal(false);
                setSuggestion('');
                setSending(false);
            });
    }

    return (
        <div className="mb-2">
            <Toast ref={toast} position='top-center' />
            <span
                onClick={() => setShowModal(true)}
                style={{ fontSize: 12 }}
            >Sugestão?</span>
            <Dialog
                header="Sugestão de melhoria"
                visible={showModal}
                onHide={() => setShowModal(false)}
                draggable={false}>
                <form
                    className='d-flex flex-column'
                    onSubmit={onSendSuggestion}>
                    <InputTextarea
                        placeholder="Descreva sua sugestão"
                        rows={5}
                        cols={30}
                        onChange={(e) => setSuggestion(e.target.value)}
                        value={suggestion}
                    />
                    <Button
                        type='submit'
                        label="Enviar"
                        size="small"
                        icon="pi pi-check"
                        className="align-self-end mt-2"
                        disabled={sending}
                        loading={sending} />
                </form>
            </Dialog>
        </div>
    );
}