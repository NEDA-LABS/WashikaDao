import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Address } from "abitype";

interface ImultiSigners {
    treasurerAddr: Address,
    chairAddr: Address,
    creatorAddr: Address
}

const initialState: ImultiSigners = {
    treasurerAddr: '',
    chairAddr: '',
    creatorAddr: '',
}

const multisignersSlice = createSlice({
    name: 'multisigners',
    initialState,
    reducers: {
        setMultiSigners(state, action: PayloadAction<ImultiSigners>){
            // Mutate State directly by assigning values from action payload 
            state.chairAddr = action.payload.chairAddr;
            state.creatorAddr = action.payload.creatorAddr;
            state.treasurerAddr = action.payload.treasurerAddr;
        }, 
        clearMultiSigners(state) {
            // Reset the state to initial variables 
            state.chairAddr = initialState.chairAddr;
            state.creatorAddr = initialState.creatorAddr;
            state.treasurerAddr = initialState.treasurerAddr;
        },
    },
}); 

export const { setMultiSigners, clearMultiSigners } = multisignersSlice.actions; 
export default multisignersSlice.reducer; 