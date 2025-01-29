import getId from "../core/id.js";
import { LocalState } from "../core/state.js";

export default class InputInfoCache {

  public static list: {
    [key: string]: InputInfoCache;
  } = {};

  static get(complex_id: string | undefined): InputInfoCache | null {
    const [tag, id] = this.breakId(complex_id);
    if(id == null) return null;
    return this.list[id] ?? null;
  }

  static breakId(complex_id: string | undefined): [string?, string?] {
    return (complex_id ?? "").split(":") as [string?, string?];
  }

  public id: string;

  constructor(
    public state: LocalState,
    public data: any,
  ) {
    this.id = getId();
    this.add();
  }

  private add() {
    InputInfoCache.list[this.id] = this;
  }

  clear() {
    if(this.id in InputInfoCache.list) delete InputInfoCache.list[this.id];   
  }

}