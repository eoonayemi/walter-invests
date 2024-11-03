import mongoose from "mongoose";

type CodeType = {
  code: string;
};

const codeSchema = new mongoose.Schema<CodeType>({
  code: { type: String, required: true },
});

const Code = mongoose.model<CodeType>("Code", codeSchema);

export default Code;
