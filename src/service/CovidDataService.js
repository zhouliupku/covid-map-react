import axios from "axios";

// return promise(succeess or failed)
export const CovidDataService = {
    getAllCountyCases: function() {
        return axios.get("https://corona.lmao.ninja/v2/jhucsse/counties");
    }
}