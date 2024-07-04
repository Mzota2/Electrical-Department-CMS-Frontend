import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {appUrl} from '../Helpers';

export const getPrograms = createAsyncThunk('programs/getPrograms', async()=>{
    try {
        const response = await axios.get(`${appUrl}program`);
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

const programsSlice = createSlice({
    initialState,
    name:'programs',
    reducers:{},
    extraReducers(build){
        build.addCase(getPrograms.fulfilled, (state, action)=>{
            state.status = 'succeeded';
            state.data = action.payload;

        })

        .addCase(getPrograms.rejected, (state, action)=>{
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
});

const {} = programsSlice.actions;
export default programsSlice.reducer;