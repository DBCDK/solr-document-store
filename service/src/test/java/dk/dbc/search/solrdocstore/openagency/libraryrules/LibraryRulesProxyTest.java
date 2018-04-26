package dk.dbc.search.solrdocstore.openagency.libraryrules;

import dk.dbc.search.solrdocstore.LibraryConfig;
import dk.dbc.search.solrdocstore.LibraryType;
import org.junit.Assert;
import org.junit.Test;
import org.mockito.Mockito;

public class LibraryRulesProxyTest {

    LibraryRules anFBSSchoolResult = new LibraryRules("Skolebibliotek", true);
    LibraryRules anFBSResult = new LibraryRules("Folkebibliotek", true);
    LibraryRules aNonFBSResult = new LibraryRules("Anything", false);

    LibraryRulesProxy proxy = new LibraryRulesProxy();

    @Test
    public void testFBSSchool() {
        OpenAgencyClient mock = Mockito.mock(OpenAgencyClient.class);
        Mockito.when(mock.fetchLibraryRuleFor(Mockito.anyInt())).thenReturn(anFBSSchoolResult);
        proxy.oaclient = mock;
        LibraryType libraryType = proxy.fetchLibraryTypeFor(1);
        Assert.assertEquals(LibraryType.FBSSchool, libraryType);
    }

    @Test
    public void testFBS() {
        OpenAgencyClient mock = Mockito.mock(OpenAgencyClient.class);
        Mockito.when(mock.fetchLibraryRuleFor(Mockito.anyInt())).thenReturn(anFBSResult);
        proxy.oaclient = mock;
        LibraryType libraryType = proxy.fetchLibraryTypeFor(1);
        Assert.assertEquals(LibraryType.FBS, libraryType);
    }

    @Test
    public void testNonFBS() {
        OpenAgencyClient mock = Mockito.mock(OpenAgencyClient.class);
        Mockito.when(mock.fetchLibraryRuleFor(Mockito.anyInt())).thenReturn(aNonFBSResult);
        proxy.oaclient = mock;
        LibraryType libraryType = proxy.fetchLibraryTypeFor(1);
        Assert.assertEquals(LibraryType.NonFBS, libraryType);
    }
}
