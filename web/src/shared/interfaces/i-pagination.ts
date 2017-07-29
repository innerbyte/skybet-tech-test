/**
 * Created by vlad on 19/04/17.
 */

export interface IPagination {
    offset: number;
    limit: number;
    total_records?: number;
}