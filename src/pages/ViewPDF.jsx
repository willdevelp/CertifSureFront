import React from 'react';
// import { useLocation } from 'react-router-dom';
// import { Document, Page } from 'react-pdf-js';

function ViewPDF() {
    // const location = useLocation();
    // const fileUrl = location.state?.fileUrl; // Récupère l'URL du fichier PDF transmis via state

    return (
        <div>
            {/* <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Affichage du PDF</h1>
                {fileUrl ? (
                    <div>
                        <Document file={fileUrl}>
                            <Page pageNumber={1} />
                        </Document>
                    </div>
                ) : (
                    <p className="text-red-500">Aucun fichier PDF sélectionné.</p>
                )}
            </div> */}
        </div>
    );
}

export default ViewPDF;