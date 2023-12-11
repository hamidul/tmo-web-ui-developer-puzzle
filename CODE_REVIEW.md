# Code Smells
***

* **Code Smell1:**
In **reading-list.reducer.ts**, the actions **failedAddToReadingList** and **failedRemoveFromReadingList** are not being intercepted by the reducer. It's crucial to address the failure scenarios of adding or removing books through API calls. By handling these actions, we can appropriately revert the state for added or removed books. Failing to do so may lead to inaccurate data being displayed to the user.
**(Fixed)**


* **Code Smell2:** 
The **"img"** tag is missing the "**alt**" attribute in some files. For example, **reading-list.component.html,book-search.component.html**,**reading-list.component.html** etc.
**(Fixed)**


* **Code Smell3:**
In **books.reducer.ts**, the **"searchTerm"** property in the store is updated by the reducer, but it is not referenced anywhere in the component or selector, indicating it may be an unused property.
**(Fixed)**


* **Code Smell4:**
Angular's **DatePipe** serves the purpose of formatting dates. However, in the **book-search.component.html** file, the formatDate() function is utilized instead. Opting for DatePipe offers numerous benefits such as Readability and Maintainability, Consistency, Internationalization (i18n) and Localization (l10n), Flexibility and Configuration, Angular Integration.
**(Fixed)**


* **Code Smell5:**
In **book-search.component.ts**, we are currently subscribing to **getAllBooks** without unsubscribing afterward. Unsubscribe in OnDestroy to prevent memory leaks in long-lived components.
**(Fixed)**


# Improvements:
***
* Deactivate the search icon when there is no search term.
* Add a clear button to erase the search term.
* Proper error handling was not done, an internal server error occurred, but there were no  appropriate messages on the UI.
* Make the thumbnail of the image clickable in search results. Upon clicking, it should reveal the details of the book
* The book search result is consistently limited to 10, but we can raise the search results limit and introduce pagination.
* In **reading-list.effects.ts** and **books.effects.ts**, the API URLs are currently hardcoded. It is advisable to avoid direct hardcoding of API endpoints in the service calls. Instead, consider defining the API endpoint as a constant. This practice enhances code maintainability and facilitates easier management and updates to the endpoint in the future.**(Fixed)**
* The line ```"<img alt="cover" src="{{ b.coverUrl }}" />"```in **book-search.component.html** is a simple Angular template code for displaying an image. However, we should use property binding instead of interpolation for dynamic values because it's useful for handling dynamic content, such as updating an image source or setting styles based on component data. In contrast, interpolation is more suitable for rendering simple values directly into the template. **(Fixed)**
* As in the file **book-search.component.html**,the class name **"book--title"** seems to follow a BEM-like (Block Element Modifier) convention.However, there's a subtle point to consider: BEM convention typically uses double underscores (__) for elements and double dashes (--) for modifiers. So, if "book--title" is meant to represent a block, we should use a double underscore instead, like "book__title" for consistency with BEM.Example,
```
<div class="book__title">
  <!-- Content goes here -->
</div>
```
# Accessibility:
***
### Automatic Accessibility Detection by Lighthouse Extension:
* Buttons do not have an accessible name **(Fixed)**
* Background and foreground colors do not have a sufficient contrast ratio. **(Fixed)**

### Manual Accessibility Detection:
* Some **'img'** tags are missing **'alt'** attribute which are not detected by Lighthouse **(Fixed)** 
* The plugin couldn't detect missing **'aria-label'** attribute in **'Want to Read'** **(Fixed)** 
* The plugin couldn't detect missing **'aria-label'** attribute in **'Reading List'** **(Fixed)** 
* In the **app.component.html** file, the close reading list button is currently an icon-only button. To enhance accessibility, we should include the aria-label attribute for the button, providing valuable information to screen readers.
* In **book-search.component.html**, the **"JavaScript"** link should be represented as a button instead of an anchor tag since we aren't utilizing the href attribute for redirection to another page. The button format aligns better with our intention of triggering a search action solely through a click event.