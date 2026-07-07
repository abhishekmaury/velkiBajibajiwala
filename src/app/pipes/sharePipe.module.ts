import { NgModule } from "@angular/core";
import { DatePipePipe } from "./date-pipe.pipe";


@NgModule({

    declarations : [
        DatePipePipe
    ],
    exports :[
        DatePipePipe
    ]
})

export class PipeModule{

}