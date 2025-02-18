import { updateItemList } from "./myDetailListSlice";

export const createAsyncReducers = (builder, actions, stateKey) => {
  builder
    .addCase(actions.fetchData.pending, (state) => {
      state[stateKey].status = "loading";
    })
    .addCase(actions.fetchData.fulfilled, (state, action) => {
      state[stateKey].status = "succeeded";
      state[stateKey].items = action.payload;
    })
    .addCase(actions.fetchData.rejected, (state, action) => {
      state[stateKey].status = "failed";
      state[stateKey].error = action.error.message;
    })
    .addCase(actions.saveData.fulfilled, (state, action) => {
      state[stateKey].saveStatus = "succeeded";
      const idField = state[stateKey].idField;
      state[stateKey].items = updateItemList(
        state[stateKey].items,
        action.payload,
        idField
      );
    })
    .addCase(actions.saveData.rejected, (state, action) => {
      state[stateKey].saveStatus = "failed";
      state[stateKey].error = action.error.message;
      console.error("Save Data Error: ", action.error);
    })
    .addCase(actions.deleteData.fulfilled, (state, action) => {
      state[stateKey].deleteStatus = "succeeded";
      state[stateKey].items = action.payload;
    })
    .addCase(actions.deleteData.rejected, (state, action) => {
      state[stateKey].deleteStatus = "failed";
      state[stateKey].error = action.error.message;
      console.error("Delete Data Error: ", action.error);
    });
};
