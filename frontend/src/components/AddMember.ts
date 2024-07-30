//import client.ts 
import { useState } from "react";
//TODO: Function including form to add members, --> foward Request to backend for sanitization 
interface IAddMemberFD {
    _phoneNo: number;
    _nationalIDNo: number;
    _email: string;
    _memberAddr: string;
    _callerAddr: string;
    _daoToJoinMultisig: string;
    _role: string;
}

export default async function AddMember() {
    const [addMem, setAddMem] = useState<IAddMemberFD>({
        _phoneNo: 0,
        _nationalIDNo: 0,
        _email: '',
        _memberAddr: '',
        _callerAddr: '',
        _daoToJoinMultisig: '',
        _role: '',
    })

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setAddMem((prevaddMem) => ({
            ...prevaddMem,
            [name]: value,
        }));
    }
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const response = await fetch('/api/AddMember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(addMem)
            })
            if (response.ok) {
                //reset the form if req went well
                setAddMem({
                    _phoneNo: 0,
                    _nationalIDNo: 0,
                    _email: '',
                    _memberAddr: '',
                    _callerAddr: '',
                    _daoToJoinMultisig: '',
                    _role: '',
                });
            } else {
                console.error('Error making request to add member', await response.json())
            }
        } catch (error) {
            console.error('Error', error)
        }
    }
    return (
        <>
        {/** Form for the above*/ }
        </>
    )
}
