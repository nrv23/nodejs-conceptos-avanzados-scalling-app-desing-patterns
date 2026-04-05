/*

1. Brief Intro to Composite Pattern  
   - In a Composite structure, leaf objects (like single Products) and composite objects (like ProductCategory) 
   share the same interface.  
   - For instance, both `Product` and `ProductCategory` have a `total` getter and a `printDetails()` method.  
   - This means a composite can hold many “sub-items” (some might be leaves, some might be composites 
   themselves), treating them uniformly.

2. Examine the “Before” Code 
   - Currently, `index.js` only has `Product` objects.  
   - There’s no concept of grouping them into categories (no `ProductCategory`).  
   - The logic simply prints totals for individual products.

3. What the “After” Code Demonstrates  
   - Introduces `ProductCategory` as a container for multiple items (which can be single products or other categories).  
   - `ProductCategory.total` sums all sub-items’ totals.  
   - `ProductCategory.printDetails()` calls `printDetails()` on each sub-item.

4. Homework Steps  
   1. Create a new “Composite” Class that can hold either `Product` objects or further subcategories.  
   2. Give it a `.total` property that loops through its child items, summing up their totals.  
   3. Implement a `.printDetails()` that first prints the category name, then iterates through each child item and calls `.printDetails()` on them.  
   4. Modify `index.js` so you can group your `Products` into one or more categories, and possibly nest them if desired.  
   5. Make sure both `Product` and your new “Composite” share the same interface—both have `.total` and `.printDetails()`.  
   6. Test by calling `.total` on a big “root category” that holds multiple sub-items or subcategories, and by calling `.printDetails()` to see a full breakdown.

5. Test & Confirm  
   - Ensure that single `Product` acts like a leaf.  
   - Ensure your new composite can hold many items (including possibly other composites).  
   - Verify `.total` and `.printDetails()` work correctly without needing special-case code in `index.js`.

*/
