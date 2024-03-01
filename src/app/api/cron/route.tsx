import { Api } from "@/axios/client";

export async function GET() {
    console.log('Running cron job...');

    Api.get('/').then(response => console.log('Sucesso'), err => console.log('Erro'));

    return new Response('CRON: Check API', { status: 200 });
}