import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
interface PackageManagerState {
  packageMap: any;
  packageList: string[];
  currentFile: string;
}

// Define the initial state using that type
const initialState: PackageManagerState = {
  packageMap: {} /* An object store package name as key and package details object as value */,
  packageList: [] /* The list of all packages' name */,
  currentFile: '' /* Current file name */,
};

export const packageSlice = createSlice({
  name: 'packageManager',
  initialState,
  reducers: {
    updatePackageMap: (state, action: PayloadAction<any>) => {
      state.packageMap = action.payload;
    },
    updatePackageList: (state, action: PayloadAction<string[]>) => {
      state.packageList = action.payload;
    },
    updateCurrentFile: (state, action: PayloadAction<string>) => {
      state.currentFile = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updatePackageMap, updatePackageList, updateCurrentFile } = packageSlice.actions;
export default packageSlice.reducer;
