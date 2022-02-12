import { PutUserDto } from "./put.user.dto";

// copies PutUserDto and makes all fields optional
export interface PatchUserDto extends Partial<PutUserDto> {}