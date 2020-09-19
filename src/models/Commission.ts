import {
    getModelForClass,
    modelOptions,
    post,
    prop,
    ReturnModelType
} from "@typegoose/typegoose";

import shortid from "shortid";

@modelOptions({ schemaOptions: { collection: "Commission", timestamps: true } })
@post<CommissionClass>("save", async commission => {
    commission.shortId = shortid.generate();
    await commission.save();
    await Commission.setOrderNumber();
})
export class CommissionClass {
    @prop()
    public shortId?: string;

    @prop({ required: true })
    public email!: string;

    @prop({ required: true })
    public body!: string;

    @prop({ required: true, default: false })
    public isFinished!: boolean;

    @prop()
    public finishedAt?: Date;

    @prop()
    public paymentMethod?: string;

    @prop()
    public orderNumber?: number;

    @prop()
    public amount?: number;

    @prop()
    public estimatedFinishDate?: Date;

    @prop({ required: true, default: false })
    public isPaid!: boolean;

    @prop({ required: true, default: false })
    public isCanceled!: boolean;

    public static setOrderNumber(
        this: ReturnModelType<typeof CommissionClass>
    ) {
        return new Promise(async (resolve, reject) => {
            try {
                const commissions = await this.find({}).exec();
                let count = 0;
                for (const commission of commissions) {
                    commission.orderNumber = count;
                    await commission.save();
                    count++;
                }
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }
}
const Commission = getModelForClass(CommissionClass);

export default Commission;
