const SITE_MAP = getSiteMap();

function makeTreeNode(element) {
  const fullName = element.getAttribute("name");
  const isSelected = element.getAttribute("selected") !== null;
  const branch = {
    childBranches: [],
    element,
    isSelected,
    routeName: titleToRoute(fullName)
  };
  return branch;
}

function getSiteMap() {
  function addChildrenToTree(branch, href = "") {
    const children = branch.element.querySelectorAll(":scope > page-element");
    for (const child of children) {
      const obj = makeTreeNode(child);
      branch.childBranches.push(obj);
      const nextHref = `${href}/${obj.routeName}`;
      child.href = nextHref;
      addChildrenToTree(obj, nextHref);
    }
  }

  const trunk = makeTreeNode(document.querySelector("page-element"));
  addChildrenToTree(trunk);
  return trunk;
}

function titleToRoute(title) {
  return title.toLowerCase().replace(/\W/u, "");
}

function getStringRoute(str) {
  return str.split("/").filter(string => string);
}

function getRouteFromStringRoute(stringRoute) {
  let currentBranch = SITE_MAP;
  const route = [SITE_MAP];
  for (const string of stringRoute) {
    let foundBranch = false;
    for (const childBranch of currentBranch.childBranches) {
      if (childBranch.routeName === string) {
        route.push(childBranch);
        currentBranch = childBranch;
        foundBranch = true;
        break;
      }
    }
    if (!foundBranch) {
      break;
    }
  }
  return route;
}

function getFullRoute(route) {
  let currentBranch = route[route.length - 1];
  const fullRoute = [...route];

  while (currentBranch.childBranches.length > 0) {
    let nextBranch = currentBranch.childBranches[0];
    for (const childBranch of currentBranch.childBranches) {
      if (childBranch.isSelected) {
        nextBranch = childBranch;
        break;
      }
    }
    currentBranch = nextBranch;
    fullRoute.push(nextBranch);
  }

  return fullRoute;
}

function setDOMToRoute(fullRoute) {
  for (let i = 0, length = fullRoute.length; i < length; i++) {
    const currentBranch = fullRoute[i];
    const nextBranch = fullRoute[i + 1];
    if (!currentBranch.isSelected) {
      currentBranch.isSelected = true;
      currentBranch.element.setAttribute("selected", "");
    }
    if (nextBranch) {
      for (const childBranch of currentBranch.childBranches) {
        if (childBranch.isSelected && childBranch !== nextBranch) {
          childBranch.isSelected = false;
          childBranch.element.removeAttribute("selected");
        }
      }
    }
  }
}

function getFullRouteAsStrings(fullRoute) {
  return fullRoute.slice(1).map(childBranch => {
    return childBranch.routeName;
  });
}

export function changePage(href) {
  const stringRoute = getStringRoute(href || window.location.pathname);
  const route = getRouteFromStringRoute(stringRoute);
  const fullRoute = getFullRoute(route);
  const fullRouteAsStrings = getFullRouteAsStrings(fullRoute);
  setDOMToRoute(fullRoute);

  const fullHref = fullRouteAsStrings.join("/");

  if (href) {
    window.history.pushState(null, null, `/${fullHref}`);
  } else if (stringRoute.join("/") !== fullHref) {
    window.history.replaceState(
      null,
      null,
      `/${fullHref}${window.location.search}`
    );
  }
}

changePage();
