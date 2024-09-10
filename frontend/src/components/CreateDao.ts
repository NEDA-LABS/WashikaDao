import React, { useState } from 'react';

interface ICreateDaoFormData {
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

        </form>
        </> 
  );
};

export default CreateDaoForm;

