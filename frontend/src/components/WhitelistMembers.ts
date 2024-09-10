//import client.ts  
//TODO: Send Direct Request using contract instance to add a specific address
import { useState } from "react";

interface IWhiteListFD {
    _addrToAdd: string;
    _daoMultisig: string;
    _caller: string;
}
export async function WhitelistMembers() {
    const [whitelistFD, setwhitelistFD] = useState<IWhiteListFD>({
        _addrToAdd: '',
        _daoMultisig: '',
        _caller: '',
    });

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setwhitelistFD((prevwhitelistFD) => ({
            ...prevwhitelistFD,
            [name]: value,
        }))
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const response = await fetch('api/WhitelistMembers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(whitelistFD),
            }
            );
            if (response.ok) {
                //clear form 'cache' 
                setwhitelistFD({
                    _addrToAdd: '',
                    _daoMultisig: '',
                    _caller: '',
                });
            } else {
                console.error('Error sending whitelist request', await response.json())
            }

        } catch (error) {

        }
    }
    return (
        <>
        </>
    )

}
