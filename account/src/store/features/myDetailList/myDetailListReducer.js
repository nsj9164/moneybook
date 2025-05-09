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
    })
    .addCase(actions.saveData.rejected, (state, action) => {
      state[stateKey].saveStatus = "failed";
      state[stateKey].error = action.error.message;
      console.error("Save Data Error: ", action.error);
    })
    .addCase(actions.deleteData.fulfilled, (state, action) => {
      state[stateKey].deleteStatus = "succeeded";

      const idField = state[stateKey].idField;
      const deletedIds = action.payload;

      state[stateKey].items = state[stateKey].items.filter(
        (item) => !deletedIds.includes(item[idField])
      );
    })
    .addCase(actions.deleteData.rejected, (state, action) => {
      state[stateKey].deleteStatus = "failed";
      state[stateKey].error = action.error.message;
      console.error("Delete Data Error: ", action.error);
    });
};
