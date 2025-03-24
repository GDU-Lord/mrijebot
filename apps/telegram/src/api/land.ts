import { CreateLandDto } from "../../../core/src/controllers/land/dtos/create-land.dto";
import { Land } from "../../../core/src/entities";
import { Member } from "../app/entities/member.entity";
import axios from 'axios';

export async function createLand(
  name: string,
  region: string,
) {
  const data = {
    name,
    region,
  };
  try {
    const res = await axios.post(`http://localhost:3000/lands`, data, {
      headers: {
        'Content-Type': "application/json"
      }
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getLands() {
  try {
    const res = await axios.get<Land[]>(`http://localhost:3000/lands`);
    return res.data;
  } catch (err) {
    console.log(err);
    return [];
  }
}