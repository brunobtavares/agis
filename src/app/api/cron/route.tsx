export async function GET() {
    console.log('Running cron job...');
    return new Response('CRON: Check API', {
        status: 200
    });
}