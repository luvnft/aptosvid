import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './Mint.css';

interface MintProps {
    uploadToPinata: (file: File, name: string, description: string) => Promise<string>;
    mintNFT: (uri: string) => void;
}

interface FileWithPreview extends File {
    preview: string;
}

const Mint: React.FC<MintProps> = ({ uploadToPinata, mintNFT }) => {
    const [file, setFile] = useState<FileWithPreview | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isMinting, setIsMinting] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] },
        onDrop: (acceptedFiles) => {
            const previewFile = Object.assign(acceptedFiles[0], {
                preview: URL.createObjectURL(acceptedFiles[0]),
            }) as FileWithPreview;
            setFile(previewFile);
        },
    });

    const clearImage = () => {
        setFile(null);
    };

    const handleMint = async () => {
        if ( !file || !name || !description) {
            alert('Please complete all fields');
            return;
        }

        setIsMinting(true);

        try {
            const IpfsHash = await uploadToPinata(file, name, description);
            // const IpfsHash = `bafkreifw25xdtob666hxqytrgmkffqajdhgann5rfw75le6a57djsrso24`
            mintNFT(IpfsHash);
            clearImage();
        } catch (e) {
            console.log(e);
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <div className="mint-container">
            <h2>Mint Your NFT</h2>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                {file ? (
                    <div>
                        <img src={file.preview} alt="Preview" className="preview-image" />
                    </div>
                ) : (
                    <p>Drag & drop an image file, or click to select one</p>
                )}
            </div>
            {file && (
                <button 
                    className='mint-button'
                    onClick={clearImage} 
                >
                    Clear
                </button>
            )}

            <div className="form-field">
                <label>Name:</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter NFT Name" 
                />
            </div>

            <div className="form-field">
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter NFT Description"
                />
            </div>
            <button onClick={handleMint} disabled={isMinting} className='mint-button'>
                {isMinting ? 'Minting...' : 'Mint NFT'}
            </button>
        </div>
    );
};

export default Mint;