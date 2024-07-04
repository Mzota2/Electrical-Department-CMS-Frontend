import {configureStore} from '@reduxjs/toolkit';
import studentsSlice from './State/StudentsSlice';
import groupsSlice from './State/GroupsSlice';
import modulesSlice from './State/ModulesSlice';
import programsSlice from './State/ProgramsSlice';
import AnnouncementsSlice from './State/AnnouncementsSlice';

export default configureStore({
    reducer:{
       students:studentsSlice,
       programs:programsSlice,
       groups:groupsSlice,
       modules:modulesSlice,
       announcements:AnnouncementsSlice
    }
})


