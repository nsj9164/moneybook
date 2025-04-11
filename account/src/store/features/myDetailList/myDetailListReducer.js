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
      const payload = action.payload;

      if (Array.isArray(payload)) {
        const deletedIds = payload.map((item) =>
          typeof item === "object" ? item[idField] : item
        );

        state[stateKey].items = state[stateKey].items.filter(
          (item) => !deletedIds.includes(item[idField])
        );
      } else {
        const deletedId =
          typeof payload === "object" && payload !== null
            ? payload[idField]
            : payload;

        state[stateKey].items = state[stateKey].items.filter(
          (item) => item[idField] !== deletedId
        );
      }
    })
    .addCase(actions.deleteData.rejected, (state, action) => {
      state[stateKey].deleteStatus = "failed";
      state[stateKey].error = action.error.message;
      console.error("Delete Data Error: ", action.error);
    });
};
