import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { AppSettings } from '../../core/settings/constants';

@Injectable()


@Injectable({
  providedIn: 'root'
})

export class AuthService
{
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessUsername(user)
    {
        localStorage.setItem('username', user);
    }

    set accessUserID(user)
    {
        localStorage.setItem('userID', user);
    }

    set accessEmail(email)
    {
        localStorage.setItem('email', email);
    }

    set accessRole(role: string)
    {
        localStorage.setItem('role', role);
    }

    set accessToken(token: string)
    {
        localStorage.setItem('access_token', token);
    }

    set accessUserCedula(cedula:string)
    {
        localStorage.setItem('cedula', cedula);
    }

    get accessUsername(): string
    {
        return localStorage.getItem('username') ?? '';
    }

    get accessUserID(): string
    {
        return localStorage.getItem('userID') ?? '';
    }

    get accessEmail(): string
    {
        return localStorage.getItem('email') ?? '';
    }

    get accessRole(): string
    {
        return localStorage.getItem('role') ?? '';
    }

    get accessToken(): string
    {
        return localStorage.getItem('access_token') ?? '';
    }

    get accessUserCedula(): string{
        return localStorage.getItem('cedula') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param parameters
     */
    forgotPassword(parameters): any
    {
         return this._httpClient.post(`${AppSettings.API_GATEWAY}auth/forgot-password/`, parameters);
    }

    /**
     * Reset password
     *
     * @param parameters
     */
    resetPassword(parameters): any
    {
        return this._httpClient.post(`${AppSettings.API_GATEWAY}auth/reset-password`, parameters);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string, password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(`${AppSettings.API_GATEWAY}auth/login`, credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.access_token;

                this.accessUsername = response.user.name;

                this.accessUserID = response.user.id;

                this.accessEmail = response.user.email;

                this.accessUserCedula = response.user.cedula;

                this.accessRole = response.role[0].id;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Renew token
        return this._httpClient.post(`${AppSettings.API_GATEWAY}auth/refresh`, {
            access_token: this.accessToken
        }).pipe(
            catchError(() => {

                // Return false
                return of(false);
            }),
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.access_token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('userID');
        localStorage.removeItem('email');
        localStorage.removeItem('cedula');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param parameters
     */
    signUp(parameters): any
    {
        return this._httpClient.post(`${AppSettings.API_GATEWAY}auth/sign-up`, parameters);
    }

    /**
     * Change Password
     *
     * @param parameters
     */
     changePassword(parameters): any
     {
        const httpOptions = {
            headers: new HttpHeaders({})
        };
        return this._httpClient.post(`${AppSettings.API_GATEWAY}auth/change-password`, parameters, httpOptions);
     }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string, password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
