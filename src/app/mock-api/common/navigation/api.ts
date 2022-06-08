import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { compactNavigation, egresadoNavigation, adminNavigation, noneNavigation } from 'app/mock-api/common/navigation/data';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class NavigationMockApi
{
    private readonly _compactNavigation: FuseNavigationItem[] = compactNavigation;
    private readonly _egresadoNavigation: FuseNavigationItem[] = egresadoNavigation;
    private readonly _adminNavigation: FuseNavigationItem[] = adminNavigation;
    private readonly _noneNavigation: FuseNavigationItem[] = noneNavigation;
    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService, private _authService: AuthService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/navigation')
            .reply(() => {

                if(this._authService.accessRole === '1'){
                    console.log("entra uno")
                    this._compactNavigation.forEach((compactNavItem) => {
                        this._adminNavigation.forEach((defaultNavItem) => {
                            if ( defaultNavItem.id === compactNavItem.id )
                            {
                                compactNavItem.children = cloneDeep(defaultNavItem.children);
                            }
                        });
                    });
                    return [
                        200,
                        {
                            compact   : cloneDeep(this._compactNavigation),
                            default   : cloneDeep(this._adminNavigation)
                        }
                    ];
                }else if(this._authService.accessRole === '2'){
                    console.log("entra dos")
                    this._compactNavigation.forEach((compactNavItem) => {
                        this._egresadoNavigation.forEach((defaultNavItem) => {
                            if ( defaultNavItem.id === compactNavItem.id )
                            {
                                compactNavItem.children = cloneDeep(defaultNavItem.children);
                            }
                        });
                    });
                    return [
                        200,
                        {
                            compact   : cloneDeep(this._compactNavigation),
                            default   : cloneDeep(this._egresadoNavigation)
                        }
                    ];
                }else {
                    console.log("entra ninguno")
                    this._compactNavigation.forEach((compactNavItem) => {
                        this._noneNavigation.forEach((defaultNavItem) => {
                            if ( defaultNavItem.id === compactNavItem.id )
                            {
                                compactNavItem.children = cloneDeep(defaultNavItem.children);
                            }
                        });
                    });
                    return [
                        200,
                        {
                            compact   : cloneDeep(this._compactNavigation),
                            default   : cloneDeep(this._noneNavigation)
                        }
                    ];
                }
            });
    }
}
