import { DataItem } from '@/models/userData';
import { Card } from 'primereact/card';
import { useState } from 'react';
import ModalDetailsComponent from './modalDetailsComponent';

interface ClassCardComponentProps {
    item: DataItem;
}

export default function ClassCardComponent({ item }: ClassCardComponentProps) {
    const [showModal, setShowModal] = useState<boolean>(false);

    function defineAverageColor(average: any) {
        const numericAverage = Number(average);
        if (isNaN(numericAverage)) { return ''; }
        return numericAverage >= 6 ? 'text-success' : 'text-danger';
    }

    return (
        <div className='mb-2'>
            <Card
                title={
                    <div className=''>
                        <div>{item.className}</div>
                        <div style={{ fontSize: 12, fontWeight: 'lighter' }}>{item.teacherName}</div>
                    </div>
                }
                className='customCardColor'
                onClick={() => setShowModal(true)}>
                <div className='d-flex gap-5'>
                    <div>
                        <h5>Média</h5>
                        <h6 className={defineAverageColor(item.average)}>{item.average}</h6>
                    </div>
                    <div>
                        <h5>Faltas</h5>
                        <h6>{item.absence}</h6>
                    </div>
                    <div>
                        <h5>Presenças</h5>
                        <h6>{item.attendance}</h6>
                    </div>
                </div>
            </Card>
            {
                showModal
                &&
                <ModalDetailsComponent
                    classCode={item.classCode}
                    className={item.className}
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            }
        </div>
    );
}