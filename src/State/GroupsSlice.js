import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {appUrl} from '../Helpers';

export const getGroups = createAsyncThunk('groups/getGroups', async()=>{
    try {
        const response = await axios.get(`${appUrl}group`);
        const {data} = response;
        return data;
    } catch (error) {
        console.log(error);
    }
});

const initialState = {
    data:[],
    status:'idle',
    error:null
}

const groupsSlice = createSlice({
    initialState,
    name:'groups',
    reducers:{},
    extraReducers(build){
        build.addCase(getGroups.fulfilled, (state, action)=>{
            state.status = 'succeeded';
            state.data = action.payload;

        })

        .addCase(getGroups.rejected, (state, action)=>{
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
});

const {} = groupsSlice.actions;
export default groupsSlice.reducer;