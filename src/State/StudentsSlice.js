import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {appUrl} from '../Helpers';

export const getStudents = createAsyncThunk('students/getStudents', async()=>{
    try {
        const response = await axios.get(`${appUrl}student`);
        const {data} = response;
        return data;
    } catch (error) {
        console.log(error);
    }
});

const initialState = {
    isRep:false,
    data:[],
    modules:[],
    status:'idle',
    error:null,
    activeUser:undefined
}

const studentsSlice = createSlice({
    initialState,
    name:'students',
    reducers:{
        setRep:(state, action)=>{
            state.isRep = action.payload;
        },

        setActive:(state, action)=>{
            state.activeUser = action.payload;
        },

        setActiveModules:(state, action)=>{
            state.modules = action.payload;
        }
        
    },
    extraReducers(build){
        build.addCase(getStudents.fulfilled, (state, action)=>{
            state.status = 'succeeded';
            state.data = action.payload;

        })

        .addCase(getStudents.rejected, (state, action)=>{
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
});

export const {setActive, setActiveModules} = studentsSlice.actions;
export default studentsSlice.reducer;