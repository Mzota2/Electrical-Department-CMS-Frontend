import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {appUrl} from '../Helpers';

export const getAnnouncements = createAsyncThunk('announcements/getAnnouncements', async()=>{
    try {
        const response = await axios.get(`${appUrl}announcement`);
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

const announcementsSlice = createSlice({
    initialState,
    name:'announcements',
    reducers:{},
    extraReducers(build){
        build.addCase(getAnnouncements.fulfilled, (state, action)=>{
            state.status = 'succeeded';
            state.data = action.payload;

        })

        .addCase(getAnnouncements.rejected, (state, action)=>{
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
});

const {} = announcementsSlice.actions;
export default announcementsSlice.reducer;