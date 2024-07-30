import React, { useState } from 'react';

interface CDFormData {
    _daoName: string;
    _daoLocation: string;
    _targetAudience: string;
    _daoTitle: string;
    _daoDescription: string;
    _daoOverview: string;
    _daoImageIpfsHash: string;
    _multiSigAddr: string;
}

const CreateDaoForm: React.FC = () => {
    const [CDformData, setCDFormData] = useState<CDFormData>({
        _daoName: '',
        _daoLocation: '',
        _targetAudience: '',
        _daoTitle: '',
        _daoDescription: '',
        _daoOverview: '',
        _daoImageIpfsHash: '',
        _multiSigAddr: '',
    });

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setCDFormData((prevCDFormData) => ({
            ...prevCDFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await fetch('/api/createDao', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(CDformData),
            });
            if (response.ok) {
                // Reset the form after successful submission
                setCDFormData({
                    _daoName: '',
                    _daoLocation: '',
                    _targetAudience: '',
                    _daoTitle: '',
                    _daoDescription: '',
                    _daoOverview: '',
                    _daoImageIpfsHash: '',
                    _multiSigAddr: '',
                });
            } else {
                console.error('Error creating DAO:', await response.json());
            }
        } catch (error) {
            console.error('Error creating DAO:', error);
        }
    }

    return (
        <>
        <form onSubmit= { handleSubmit } >
        <label>
        DAO Name:
    <input type="text" name = "daoName" value = { formData.daoName } onChange = { handleInputChange } />
        </label>
        <label>
        DAO Location:
    <input type="text" name = "daoLocation" value = { formData.daoLocation } onChange = { handleInputChange } />
        </label>
        <label>
        Target Audience:
    <textarea name="targetAudience" value = { formData.targetAudience } onChange = { handleInputChange } />
        </label>
        <label>
        DAO Title:
    <input type="text" name = "daoTitle" value = { formData.daoTitle } onChange = { handleInputChange } />
        </label>
        <label>
        DAO Description:
    <textarea name="daoDescription" value = { formData.daoDescription } onChange = { handleInputChange } />
        </label>
        <label>
        DAO Overview:
    <textarea name="daoOverview" value = { formData.daoOverview } onChange = { handleInputChange } />
        </label>
        <label>
        DAO Image IPFS Hash:
    <input type="text" name = "daoImageIpfsHash" value = { formData.daoImageIpfsHash } onChange = { handleInputChange } />
        </label>
        <label>
    Multi - Sig Address:
    <input type="text" name = "multiSigAddr" value = { formData.multiSigAddr } onChange = { handleInputChange } />
        </label>
        < button type = "submit" > Create DAO </button>
            </form>
            </> 
  );
};

export default CreateDaoForm;

