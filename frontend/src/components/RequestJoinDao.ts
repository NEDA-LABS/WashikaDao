//import client.ts 
/**
 *TODO: Add form fetch data to request to join DAO: 
 * USE Backend Controller to destructure sent input and only fwd to contract necessary part 
 */
import { useState } from "react";

interface IReqJD {
    _multisigAddr: string;
    _requester: string;
    _role: string;
}

export default function RequestJoinDao() {

    const reqJDForm: React.FC = () => {
        const [reqJD, setReqJD] = useState<IReqJD>({
            _multisigAddr: '',
            _requester: '',
            _role: '',
        })
    }
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setreqJD(prevReqJD) => ({
            ...prevReqJD, [name]: value,
        }));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const response = await fetch('/api/requestJoinDao', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqJDForm)
            })
            if (response.ok) {
                //clearing data after form goes through 
                setReqJD({
                    _multisigAddr: '',
                    _requester: '',
                    _role: '',
                });

            } else {
                console.error('error', await response.json())
            }

        } catch (error) {
            console.error('error something went wrong')

        }

    }
    return (
        <>
        {/***form for the above**/ }
        </>
    )
}
