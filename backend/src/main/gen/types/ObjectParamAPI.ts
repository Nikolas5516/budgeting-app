import { ResponseContext, RequestContext, HttpFile } from '../http/http';
import { Configuration} from '../configuration'

import { ExpenseDTO } from '..\models\ExpenseDTO';
import { IncomeDTO } from '..\models\IncomeDTO';
import { PaymentDTO } from '..\models\PaymentDTO';
import { SavingDTO } from '..\models\SavingDTO';
import { UserDTO } from '..\models\UserDTO';

import { ObservableExpenseControllerApi } from "./ObservableAPI";
import { ExpenseControllerApiRequestFactory, ExpenseControllerApiResponseProcessor} from "../apis/ExpenseControllerApi";

export interface ExpenseControllerApiAddExpenseRequest {
    /**
     * 
     * @type ExpenseDTO
     * @memberof ExpenseControllerApiaddExpense
     */
    expenseDTO: ExpenseDTO
}

export interface ExpenseControllerApiDeleteExpenseRequest {
    /**
     * 
     * @type number
     * @memberof ExpenseControllerApideleteExpense
     */
    id: number
}

export interface ExpenseControllerApiGetAllExpensesRequest {
    /**
     * 
     * @type number
     * @memberof ExpenseControllerApigetAllExpenses
     */
    userId: number
}

export interface ExpenseControllerApiGetExpenseByIdRequest {
    /**
     * 
     * @type number
     * @memberof ExpenseControllerApigetExpenseById
     */
    id: number
}

export interface ExpenseControllerApiUpdateExpenseRequest {
    /**
     * 
     * @type number
     * @memberof ExpenseControllerApiupdateExpense
     */
    id: number
    /**
     * 
     * @type ExpenseDTO
     * @memberof ExpenseControllerApiupdateExpense
     */
    expenseDTO: ExpenseDTO
}

export class ObjectExpenseControllerApi {
    private api: ObservableExpenseControllerApi

    public constructor(configuration: Configuration, requestFactory?: ExpenseControllerApiRequestFactory, responseProcessor?: ExpenseControllerApiResponseProcessor) {
        this.api = new ObservableExpenseControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public addExpense(param: ExpenseControllerApiAddExpenseRequest, options?: Configuration): Promise<ExpenseDTO> {
        return this.api.addExpense(param.expenseDTO,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public deleteExpense(param: ExpenseControllerApiDeleteExpenseRequest, options?: Configuration): Promise<void> {
        return this.api.deleteExpense(param.id,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public getAllExpenses(param: ExpenseControllerApiGetAllExpensesRequest, options?: Configuration): Promise<Array<ExpenseDTO>> {
        return this.api.getAllExpenses(param.userId,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public getExpenseById(param: ExpenseControllerApiGetExpenseByIdRequest, options?: Configuration): Promise<ExpenseDTO> {
        return this.api.getExpenseById(param.id,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public updateExpense(param: ExpenseControllerApiUpdateExpenseRequest, options?: Configuration): Promise<ExpenseDTO> {
        return this.api.updateExpense(param.id, param.expenseDTO,  options).toPromise();
    }

}

import { ObservableIncomeControllerApi } from "./ObservableAPI";
import { IncomeControllerApiRequestFactory, IncomeControllerApiResponseProcessor} from "../apis/IncomeControllerApi";

export interface IncomeControllerApiCreateIncomeRequest {
    /**
     * 
     * @type IncomeDTO
     * @memberof IncomeControllerApicreateIncome
     */
    incomeDTO: IncomeDTO
}

export interface IncomeControllerApiDeleteIncomeRequest {
    /**
     * 
     * @type number
     * @memberof IncomeControllerApideleteIncome
     */
    id: number
}

export interface IncomeControllerApiGetAllIncomesRequest {
}

export interface IncomeControllerApiGetIncomeByIdRequest {
    /**
     * 
     * @type number
     * @memberof IncomeControllerApigetIncomeById
     */
    id: number
}

export interface IncomeControllerApiUpdateIncomeRequest {
    /**
     * 
     * @type number
     * @memberof IncomeControllerApiupdateIncome
     */
    id: number
    /**
     * 
     * @type IncomeDTO
     * @memberof IncomeControllerApiupdateIncome
     */
    incomeDTO: IncomeDTO
}

export class ObjectIncomeControllerApi {
    private api: ObservableIncomeControllerApi

    public constructor(configuration: Configuration, requestFactory?: IncomeControllerApiRequestFactory, responseProcessor?: IncomeControllerApiResponseProcessor) {
        this.api = new ObservableIncomeControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public createIncome(param: IncomeControllerApiCreateIncomeRequest, options?: Configuration): Promise<IncomeDTO> {
        return this.api.createIncome(param.incomeDTO,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public deleteIncome(param: IncomeControllerApiDeleteIncomeRequest, options?: Configuration): Promise<void> {
        return this.api.deleteIncome(param.id,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public getAllIncomes(param: IncomeControllerApiGetAllIncomesRequest = {}, options?: Configuration): Promise<Array<IncomeDTO>> {
        return this.api.getAllIncomes( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public getIncomeById(param: IncomeControllerApiGetIncomeByIdRequest, options?: Configuration): Promise<IncomeDTO> {
        return this.api.getIncomeById(param.id,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public updateIncome(param: IncomeControllerApiUpdateIncomeRequest, options?: Configuration): Promise<IncomeDTO> {
        return this.api.updateIncome(param.id, param.incomeDTO,  options).toPromise();
    }

}

import { ObservablePaymentControllerApi } from "./ObservableAPI";
import { PaymentControllerApiRequestFactory, PaymentControllerApiResponseProcessor} from "../apis/PaymentControllerApi";

export interface PaymentControllerApiDeleteRequest {
    /**
     * 
     * @type number
     * @memberof PaymentControllerApi_delete
     */
    id: number
}

export interface PaymentControllerApiCreateRequest {
    /**
     * 
     * @type PaymentDTO
     * @memberof PaymentControllerApicreate
     */
    paymentDTO: PaymentDTO
}

export interface PaymentControllerApiGetAllRequest {
}

export interface PaymentControllerApiGetByIdRequest {
    /**
     * 
     * @type number
     * @memberof PaymentControllerApigetById
     */
    id: number
}

export interface PaymentControllerApiUpdateRequest {
    /**
     * 
     * @type number
     * @memberof PaymentControllerApiupdate
     */
    id: number
    /**
     * 
     * @type PaymentDTO
     * @memberof PaymentControllerApiupdate
     */
    paymentDTO: PaymentDTO
}

export class ObjectPaymentControllerApi {
    private api: ObservablePaymentControllerApi

    public constructor(configuration: Configuration, requestFactory?: PaymentControllerApiRequestFactory, responseProcessor?: PaymentControllerApiResponseProcessor) {
        this.api = new ObservablePaymentControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public _delete(param: PaymentControllerApiDeleteRequest, options?: Configuration): Promise<any> {
        return this.api._delete(param.id,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public create(param: PaymentControllerApiCreateRequest, options?: Configuration): Promise<any> {
        return this.api.create(param.paymentDTO,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public getAll(param: PaymentControllerApiGetAllRequest = {}, options?: Configuration): Promise<Array<PaymentDTO>> {
        return this.api.getAll( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public getById(param: PaymentControllerApiGetByIdRequest, options?: Configuration): Promise<any> {
        return this.api.getById(param.id,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public update(param: PaymentControllerApiUpdateRequest, options?: Configuration): Promise<any> {
        return this.api.update(param.id, param.paymentDTO,  options).toPromise();
    }

}

import { ObservableSavingApi } from "./ObservableAPI";
import { SavingApiRequestFactory, SavingApiResponseProcessor} from "../apis/SavingApi";

export interface SavingApiAddSavingRequest {
    /**
     * Saving to add
     * @type SavingDTO
     * @memberof SavingApiaddSaving
     */
    savingDTO: SavingDTO
}

export interface SavingApiDeleteSavingRequest {
    /**
     * ID of saving to delete
     * @type number
     * @memberof SavingApideleteSaving
     */
    savingId: number
}

export interface SavingApiGetAllSavingsRequest {
}

export interface SavingApiGetSavingByIdRequest {
    /**
     * ID of saving to return
     * @type number
     * @memberof SavingApigetSavingById
     */
    savingId: number
}

export interface SavingApiUpdateSavingRequest {
    /**
     * ID of saving to update
     * @type number
     * @memberof SavingApiupdateSaving
     */
    savingId: number
    /**
     * Updated saving
     * @type SavingDTO
     * @memberof SavingApiupdateSaving
     */
    savingDTO: SavingDTO
}

export class ObjectSavingApi {
    private api: ObservableSavingApi

    public constructor(configuration: Configuration, requestFactory?: SavingApiRequestFactory, responseProcessor?: SavingApiResponseProcessor) {
        this.api = new ObservableSavingApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Add a new saving
     * @param param the request object
     */
    public addSaving(param: SavingApiAddSavingRequest, options?: Configuration): Promise<any> {
        return this.api.addSaving(param.savingDTO,  options).toPromise();
    }

    /**
     * Delete a saving by ID
     * @param param the request object
     */
    public deleteSaving(param: SavingApiDeleteSavingRequest, options?: Configuration): Promise<any> {
        return this.api.deleteSaving(param.savingId,  options).toPromise();
    }

    /**
     * Returns all available savings
     * Get all savings
     * @param param the request object
     */
    public getAllSavings(param: SavingApiGetAllSavingsRequest = {}, options?: Configuration): Promise<any> {
        return this.api.getAllSavings( options).toPromise();
    }

    /**
     * Returns a single saving
     * Get saving by ID
     * @param param the request object
     */
    public getSavingById(param: SavingApiGetSavingByIdRequest, options?: Configuration): Promise<any> {
        return this.api.getSavingById(param.savingId,  options).toPromise();
    }

    /**
     * Update an existing saving by ID
     * @param param the request object
     */
    public updateSaving(param: SavingApiUpdateSavingRequest, options?: Configuration): Promise<any> {
        return this.api.updateSaving(param.savingId, param.savingDTO,  options).toPromise();
    }

}

import { ObservableTestControllerApi } from "./ObservableAPI";
import { TestControllerApiRequestFactory, TestControllerApiResponseProcessor} from "../apis/TestControllerApi";

export interface TestControllerApiTestEndpointRequest {
}

export class ObjectTestControllerApi {
    private api: ObservableTestControllerApi

    public constructor(configuration: Configuration, requestFactory?: TestControllerApiRequestFactory, responseProcessor?: TestControllerApiResponseProcessor) {
        this.api = new ObservableTestControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public testEndpoint(param: TestControllerApiTestEndpointRequest = {}, options?: Configuration): Promise<Array<string>> {
        return this.api.testEndpoint( options).toPromise();
    }

}

import { ObservableUserApi } from "./ObservableAPI";
import { UserApiRequestFactory, UserApiResponseProcessor} from "../apis/UserApi";

export interface UserApiCreateUserRequest {
    /**
     * 
     * @type UserDTO
     * @memberof UserApicreateUser
     */
    userDTO: UserDTO
}

export interface UserApiDeleteUserRequest {
    /**
     * 
     * @type number
     * @memberof UserApideleteUser
     */
    id: number
}

export interface UserApiGetUserByEmailRequest {
    /**
     * 
     * @type string
     * @memberof UserApigetUserByEmail
     */
    email: string
}

export interface UserApiGetUserByIdRequest {
    /**
     * 
     * @type number
     * @memberof UserApigetUserById
     */
    id: number
}

export interface UserApiGetUsersRequest {
}

export interface UserApiUpdateUserRequest {
    /**
     * 
     * @type number
     * @memberof UserApiupdateUser
     */
    id: number
    /**
     * 
     * @type UserDTO
     * @memberof UserApiupdateUser
     */
    userDTO: UserDTO
}

export class ObjectUserApi {
    private api: ObservableUserApi

    public constructor(configuration: Configuration, requestFactory?: UserApiRequestFactory, responseProcessor?: UserApiResponseProcessor) {
        this.api = new ObservableUserApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create user
     * @param param the request object
     */
    public createUser(param: UserApiCreateUserRequest, options?: Configuration): Promise<UserDTO> {
        return this.api.createUser(param.userDTO,  options).toPromise();
    }

    /**
     * Delete user
     * @param param the request object
     */
    public deleteUser(param: UserApiDeleteUserRequest, options?: Configuration): Promise<UserDTO> {
        return this.api.deleteUser(param.id,  options).toPromise();
    }

    /**
     * Get user by email
     * @param param the request object
     */
    public getUserByEmail(param: UserApiGetUserByEmailRequest, options?: Configuration): Promise<UserDTO> {
        return this.api.getUserByEmail(param.email,  options).toPromise();
    }

    /**
     * Get user by id
     * @param param the request object
     */
    public getUserById(param: UserApiGetUserByIdRequest, options?: Configuration): Promise<UserDTO> {
        return this.api.getUserById(param.id,  options).toPromise();
    }

    /**
     * Get users
     * @param param the request object
     */
    public getUsers(param: UserApiGetUsersRequest = {}, options?: Configuration): Promise<UserDTO> {
        return this.api.getUsers( options).toPromise();
    }

    /**
     * Update user
     * @param param the request object
     */
    public updateUser(param: UserApiUpdateUserRequest, options?: Configuration): Promise<UserDTO> {
        return this.api.updateUser(param.id, param.userDTO,  options).toPromise();
    }

}
