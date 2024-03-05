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

    function defineAbsenceColor(teachingHours: any, absence: any) {
        const numericAbsence = Number(absence);
        const numericTeachingHours = Number(teachingHours);

        if (isNaN(numericAbsence)) { return ''; }
        if (isNaN(numericTeachingHours)) { return ''; }

        if (numericAbsence == 0) { return "#198754"; }

        const max = 25;
        const min = 0;

        const percent = (numericAbsence / numericTeachingHours) * 100;

        // Garante que o valor esteja dentro do intervalo permitido (0 a 25)
        const adjustedValue = Math.min(max, Math.max(min, percent));

        switch (true) {
            case adjustedValue >= 0 && adjustedValue < 1:
                return "#198754";
            case adjustedValue >= 1 && adjustedValue <= 5:
                return "#339933";
            case adjustedValue >= 6 && adjustedValue <= 10:
                return "#FFDD00";
            case adjustedValue >= 11 && adjustedValue <= 20:
                return "#FF6600";
            case adjustedValue >= 21 && adjustedValue <= 25:
                return "#DC3506";
            default:
                return "rgba(255, 255, 255, 0.87)"
        }
    }

    return (
        <div className='mb-2'>
            <Card
                title={
                    <div className=''>
                        <div>{item.className}</div>
                        <div style={{ fontSize: 12, fontWeight: 'lighter' }}>{item.teacherName}</div>
                        <div style={{ fontSize: 10, fontWeight: 'lighter' }}>{item.schedule}</div>
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
                        <h6 style={{ color: defineAbsenceColor(item.teachingHours, item.absence) }}>{item.absence}</h6>
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