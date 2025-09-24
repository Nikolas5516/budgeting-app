import { ResponseContext, RequestContext, HttpFile } from '../http/http';
import { Configuration} from '../configuration'

import { ExpenseDTO } from '..\models\ExpenseDTO';
import { IncomeDTO } from '..\models\IncomeDTO';
import { PaymentDTO } from '..\models\PaymentDTO';
import { SavingDTO } from '..\models\SavingDTO';
import { UserDTO } from '..\models\UserDTO';
import { ObservableExpenseControllerApi } from './ObservableAPI';

import { ExpenseControllerApiRequestFactory, ExpenseControllerApiResponseProcessor} from "../apis/ExpenseControllerApi";
export class PromiseExpenseControllerApi {
    private api: ObservableExpenseControllerApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ExpenseControllerApiRequestFactory,
        responseProcessor?: ExpenseControllerApiResponseProcessor
    ) {
        this.api = new ObservableExpenseControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param expenseDTO 
     */
    public addExpense(expenseDTO: ExpenseDTO, _options?: Configuration): Promise<ExpenseDTO> {
        const result = this.api.addExpense(expenseDTO, _options);
        return result.toPromise();
    }

    /**
     * @param id 
     */
    public deleteExpense(id: number, _options?: Configuration): Promise<void> {
        const result = this.api.deleteExpense(id, _options);
        return result.toPromise();
    }

    /**
     * @param userId 
     */
    public getAllExpenses(userId: number, _options?: Configuration): Promise<Array<ExpenseDTO>> {
        const result = this.api.getAllExpenses(userId, _options);
        return result.toPromise();
    }

    /**
     * @param id 
     */
    public getExpenseById(id: number, _options?: Configuration): Promise<ExpenseDTO> {
        const result = this.api.getExpenseById(id, _options);
        return result.toPromise();
    }

    /**
     * @param id 
     * @param expenseDTO 
     */
    public updateExpense(id: number, expenseDTO: ExpenseDTO, _options?: Configuration): Promise<ExpenseDTO> {
        const result = this.api.updateExpense(id, expenseDTO, _options);
        return result.toPromise();
    }


}



import { ObservableIncomeControllerApi } from './ObservableAPI';

import { IncomeControllerApiRequestFactory, IncomeControllerApiResponseProcessor} from "../apis/IncomeControllerApi";
export class PromiseIncomeControllerApi {
    private api: ObservableIncomeControllerApi

    public constructor(
        configuration: Configuration,
        requestFactory?: IncomeControllerApiRequestFactory,
        responseProcessor?: IncomeControllerApiResponseProcessor
    ) {
        this.api = new ObservableIncomeControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param incomeDTO 
     */
    public createIncome(incomeDTO: IncomeDTO, _options?: Configuration): Promise<IncomeDTO> {
        const result = this.api.createIncome(incomeDTO, _options);
        return result.toPromise();
    }

    /**
     * @param id 
     */
    public deleteIncome(id: number, _options?: Configuration): Promise<void> {
        const result = this.api.deleteIncome(id, _options);
        return result.toPromise();
    }

    /**
     */
    public getAllIncomes(_options?: Configuration): Promise<Array<IncomeDTO>> {
        const result = this.api.getAllIncomes(_options);
        return result.toPromise();
    }

    /**
     * @param id 
     */
    public getIncomeById(id: number, _options?: Configuration): Promise<IncomeDTO> {
        const result = this.api.getIncomeById(id, _options);
        return result.toPromise();
    }

    /**
     * @param id 
     * @param incomeDTO 
     */
    public updateIncome(id: number, incomeDTO: IncomeDTO, _options?: Configuration): Promise<IncomeDTO> {
        const result = this.api.updateIncome(id, incomeDTO, _options);
        return result.toPromise();
    }


}



import { ObservablePaymentControllerApi } from './ObservableAPI';

import { PaymentControllerApiRequestFactory, PaymentControllerApiResponseProcessor} from "../apis/PaymentControllerApi";
export class PromisePaymentControllerApi {
    private api: ObservablePaymentControllerApi

    public constructor(
        configuration: Configuration,
        requestFactory?: PaymentControllerApiRequestFactory,
        responseProcessor?: PaymentControllerApiResponseProcessor
    ) {
        this.api = new ObservablePaymentControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param id 
     */
    public _delete(id: number, _options?: Configuration): Promise<any> {
        const result = this.api._delete(id, _options);
        return result.toPromise();
    }

    /**
     * @param paymentDTO 
     */
    public create(paymentDTO: PaymentDTO, _options?: Configuration): Promise<any> {
        const result = this.api.create(paymentDTO, _options);
        return result.toPromise();
    }

    /**
     */
    public getAll(_options?: Configuration): Promise<Array<PaymentDTO>> {
        const result = this.api.getAll(_options);
        return result.toPromise();
    }

    /**
     * @param id 
     */
    public getById(id: number, _options?: Configuration): Promise<any> {
        const result = this.api.getById(id, _options);
        return result.toPromise();
    }

    /**
     * @param id 
     * @param paymentDTO 
     */
    public update(id: number, paymentDTO: PaymentDTO, _options?: Configuration): Promise<any> {
        const result = this.api.update(id, paymentDTO, _options);
        return result.toPromise();
    }


}



import { ObservableSavingApi } from './ObservableAPI';

import { SavingApiRequestFactory, SavingApiResponseProcessor} from "../apis/SavingApi";
export class PromiseSavingApi {
    private api: ObservableSavingApi

    public constructor(
        configuration: Configuration,
        requestFactory?: SavingApiRequestFactory,
        responseProcessor?: SavingApiResponseProcessor
    ) {
        this.api = new ObservableSavingApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Add a new saving
     * @param savingDTO Saving to add
     */
    public addSaving(savingDTO: SavingDTO, _options?: Configuration): Promise<any> {
        const result = this.api.addSaving(savingDTO, _options);
        return result.toPromise();
    }

    /**
     * Delete a saving by ID
     * @param savingId ID of saving to delete
     */
    public deleteSaving(savingId: number, _options?: Configuration): Promise<any> {
        const result = this.api.deleteSaving(savingId, _options);
        return result.toPromise();
    }

    /**
     * Returns all available savings
     * Get all savings
     */
    public getAllSavings(_options?: Configuration): Promise<any> {
        const result = this.api.getAllSavings(_options);
        return result.toPromise();
    }

    /**
     * Returns a single saving
     * Get saving by ID
     * @param savingId ID of saving to return
     */
    public getSavingById(savingId: number, _options?: Configuration): Promise<any> {
        const result = this.api.getSavingById(savingId, _options);
        return result.toPromise();
    }

    /**
     * Update an existing saving by ID
     * @param savingId ID of saving to update
     * @param savingDTO Updated saving
     */
    public updateSaving(savingId: number, savingDTO: SavingDTO, _options?: Configuration): Promise<any> {
        const result = this.api.updateSaving(savingId, savingDTO, _options);
        return result.toPromise();
    }


}



import { ObservableTestControllerApi } from './ObservableAPI';

import { TestControllerApiRequestFactory, TestControllerApiResponseProcessor} from "../apis/TestControllerApi";
export class PromiseTestControllerApi {
    private api: ObservableTestControllerApi

    public constructor(
        configuration: Configuration,
        requestFactory?: TestControllerApiRequestFactory,
        responseProcessor?: TestControllerApiResponseProcessor
    ) {
        this.api = new ObservableTestControllerApi(configuration, requestFactory, responseProcessor);
    }

    /**
     */
    public testEndpoint(_options?: Configuration): Promise<Array<string>> {
        const result = this.api.testEndpoint(_options);
        return result.toPromise();
    }


}



import { ObservableUserApi } from './ObservableAPI';

import { UserApiRequestFactory, UserApiResponseProcessor} from "../apis/UserApi";
export class PromiseUserApi {
    private api: ObservableUserApi

    public constructor(
        configuration: Configuration,
        requestFactory?: UserApiRequestFactory,
        responseProcessor?: UserApiResponseProcessor
    ) {
        this.api = new ObservableUserApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create user
     * @param userDTO 
     */
    public createUser(userDTO: UserDTO, _options?: Configuration): Promise<UserDTO> {
        const result = this.api.createUser(userDTO, _options);
        return result.toPromise();
    }

    /**
     * Delete user
     * @param id 
     */
    public deleteUser(id: number, _options?: Configuration): Promise<UserDTO> {
        const result = this.api.deleteUser(id, _options);
        return result.toPromise();
    }

    /**
     * Get user by email
     * @param email 
     */
    public getUserByEmail(email: string, _options?: Configuration): Promise<UserDTO> {
        const result = this.api.getUserByEmail(email, _options);
        return result.toPromise();
    }

    /**
     * Get user by id
     * @param id 
     */
    public getUserById(id: number, _options?: Configuration): Promise<UserDTO> {
        const result = this.api.getUserById(id, _options);
        return result.toPromise();
    }

    /**
     * Get users
     */
    public getUsers(_options?: Configuration): Promise<UserDTO> {
        const result = this.api.getUsers(_options);
        return result.toPromise();
    }

    /**
     * Update user
     * @param id 
     * @param userDTO 
     */
    public updateUser(id: number, userDTO: UserDTO, _options?: Configuration): Promise<UserDTO> {
        const result = this.api.updateUser(id, userDTO, _options);
        return result.toPromise();
    }


}



