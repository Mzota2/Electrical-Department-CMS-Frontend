import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {appUrl} from '../Helpers';

export const getModules = createAsyncThunk('modules/getModules', async()=>{
    try {
        const response = await axios.get(`${appUrl}module`);
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

const modulesSlice = createSlice({
    initialState,
    name:'modules',
    reducers:{},
    extraReducers(build){
        build.addCase(getModules.fulfilled, (state, action)=>{
            state.status = 'succeeded';
            state.data = action.payload;

        })

        .addCase(getModules.rejected, (state, action)=>{
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
});

const {} = modulesSlice.actions;
export default modulesSlice.reducer;