import { Button } from "primereact/button";
import { useEffect, useState } from "react";

export default function AddToHomeScreen() {
    const [installable, setInstallable] = useState(false);

    let deferredPrompt: any;
    useEffect(() => {
        window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault();
            deferredPrompt = e;
            setInstallable(true);
        });

        window.addEventListener('appinstalled', () => {
            console.log('INSTALL: Success');
        });
    }, []);

    async function onInstallApp() {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        deferredPrompt = null;
        setInstallable(false);
    }

    if (!installable) return null;

    return (
        <div>
            <Button type='button' label="Instalar App" size="small" icon="pi pi-check" iconPos='right' onClick={onInstallApp} />
        </div>
    );
}

// import React, { useState, useEffect } from 'react';
// import { setCookie, getCookie } from 'cookies-next';
// import dynamic from 'next/dynamic';

// const ModuleLoading = () => <p className="animate-bounce text-white font-bold">Loading...</p>;
// // const AddToIosSafari = dynamic(() => import('./AddToIosSafari'), { loading: () => <ModuleLoading /> });
// // const AddToMobileChrome = dynamic(() => import('./AddToMobileChrome'), { loading: () => <ModuleLoading /> });
// // const AddToMobileFirefox = dynamic(() => import('./AddToMobileFirefox'), { loading: () => <ModuleLoading /> });
// // const AddToMobileFirefoxIos = dynamic(() => import('./AddToMobileFirefoxIos'), { loading: () => <ModuleLoading /> });
// // const AddToMobileChromeIos = dynamic(() => import('./AddToMobileChromeIos'), { loading: () => <ModuleLoading /> });
// // const AddToSamsung = dynamic(() => import('./AddToSamsung'), { loading: () => <ModuleLoading /> });
// // const AddToOtherBrowser = dynamic(() => import('./AddToOtherBrowser'), { loading: () => <ModuleLoading /> });

// import useUserAgent from '@/hooks/useUserAgent';

// type AddToHomeScreenPromptType = 'safari' | 'chrome' | 'firefox' | 'other' | 'firefoxIos' | 'chromeIos' | 'samsung' | '';
// const COOKIE_NAME = 'addToHomeScreenPrompt';

// export default function AddToHomeScreen() {
//     const [displayPrompt, setDisplayPrompt] = useState<AddToHomeScreenPromptType>('');
//     const { userAgent, isMobile, isStandalone, isIOS } = useUserAgent();

//     const closePrompt = () => { setDisplayPrompt(''); };

//     const doNotShowAgain = () => {
//         // Create date 1 year from now
//         const date = new Date();
//         // date.setFullYear(date.getFullYear() + 1);
//         // setCookie(COOKIE_NAME, 'dontShow', { expires: date }); // Set cookie for a year
//         setDisplayPrompt('');
//     };

//     useEffect(() => {
//         const addToHomeScreenPromptCookie = getCookie(COOKIE_NAME);

//         if (addToHomeScreenPromptCookie !== 'dontShow') {
//             if (isMobile && !isStandalone) {
//                 switch (userAgent) {
//                     case 'Safari':
//                         setDisplayPrompt('safari');
//                         break;
//                     case 'Chrome':
//                         setDisplayPrompt('chrome');
//                         break;
//                     case 'Firefox':
//                         setDisplayPrompt('firefox');
//                         break;
//                     case 'FirefoxiOS':
//                         setDisplayPrompt('firefoxIos');
//                         break;
//                     case 'ChromeiOS':
//                         setDisplayPrompt('chromeIos');
//                         break;
//                     case 'SamsungBrowser':
//                         setDisplayPrompt('samsung');
//                         break;
//                     default:
//                         setDisplayPrompt('other');
//                         break;
//                 }
//             }
//         }
//     }, [userAgent, isMobile, isStandalone, isIOS]);

//     const Prompt = () => (
//         <>
//             {
//                 {
//                     'safari': <AddHomeTeste closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
//                     'chrome': <AddHomeTeste closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
//                     'firefox': <AddHomeTeste closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
//                     'firefoxIos': <AddHomeTeste closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
//                     'chromeIos': <AddHomeTeste closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
//                     'samsung': <AddHomeTeste closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
//                     'other': <AddHomeTeste closePrompt={closePrompt} doNotShowAgain={doNotShowAgain} />,
//                     '': <></>
//                 }[displayPrompt]
//             }
//         </>
//     )

//     return (
//         <>
//             {
//                 displayPrompt !== '' ?
//                     <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/70 z-50" onClick={closePrompt}>
//                         <Prompt />
//                     </div>
//                     :
//                     <></>
//             }
//         </>
//     );
// }


// interface Props {
//     closePrompt: () => void;
//     doNotShowAgain: () => void;
// }

// function AddHomeTeste(props: Props) {

//     const { closePrompt, doNotShowAgain } = props;

//     return (
//         <div className="fixed top-0 left-0 right-0 h-[60%] z-50 pt-12 px-4 text-white">
//             <i className="pi pi-user mx-1" />
//             <div className="relative bg-primary p-4 h-full rounded-xl flex flex-col justify-around items-center text-center">
//                 <button className="absolute top-0 right-0 p-3" onClick={closePrompt}>
//                     <i className="pi pi-user mx-1" />
//                 </button>
//                 <p className="text-lg">For the best experience, we recommend installing the Valley Trader app to your home screen!</p>
//                 <div className="flex gap-2 items-center text-lg">
//                     <p>Click the</p>
//                     <i className="pi pi-user mx-1" />
//                     <p>icon</p>
//                 </div>
//                 <div className="flex flex-col gap-2 items-center text-lg w-full px-4">
//                     <p>Scroll down and then click:</p>
//                     <div className="bg-zinc-50 flex justify-between items-center w-full px-4 py-2 rounded-lg text-zinc-900">
//                         <i className="pi pi-user mx-1" />
//                         <p>Add to Home Screen</p>
//                     </div>
//                 </div>
//                 <button className="border-2 p-1" onClick={doNotShowAgain}>Don&apos;t show again</button>
//             </div>
//         </div>
//     )
// }