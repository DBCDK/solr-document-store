/*
 * Copyright (C) 2021 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-doc-store-updater-business-logic
 *
 * solr-doc-store-updater-business-logic is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solr-doc-store-updater-business-logic is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.solrdocstore.updater.businesslogic;

import com.fasterxml.jackson.databind.ObjectMapper;
import dk.dbc.vipcore.marshallers.ProfileServiceResponse;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class VipCoreProfileTest {

    private static final ObjectMapper O = new ObjectMapper();

    @Test
    @Timeout(value = 10, unit = TimeUnit.SECONDS)
    public void testFromVipCore() throws Exception {
        System.out.println("testFromVipCore");
        String content = "{'collectionIdentifiers':['150005-analyse','150005-artikel','150005-portraet','150021-bibliotek','150021-fjern','150052-ekurser','150053-turteori','150061-ebog','150061-netlydbog','800000-bibdk','870970-bibdk','870970-lokalbibl','870970-udland','870971-avis','870971-faktalink','870971-forfweb','870971-tsart','870978-artikel','870978-avis','870978-tsart','911116-katalog'],'includeOwnHoldings':false}";
        ProfileServiceResponse profileServiceResponse = O.readValue(content.replaceAll("'", "\""), ProfileServiceResponse.class);
        VipCoreProfile vipCoreProfile = new VipCoreProfile(profileServiceResponse);
        assertThat(vipCoreProfile.hasIncludeOwnHoldings(), is(false));
        assertThat(vipCoreProfile.getCollectionIdentifiers(), containsInAnyOrder(
                   "150005-analyse", "150005-artikel", "150005-portraet", "150021-bibliotek", "150021-fjern",
                   "150052-ekurser", "150053-turteori", "150061-ebog", "150061-netlydbog", "800000-bibdk",
                   "870970-bibdk", "870970-lokalbibl", "870970-udland", "870971-avis", "870971-faktalink",
                   "870971-forfweb", "870971-tsart", "870978-artikel", "870978-avis", "870978-tsart",
                   "911116-katalog"));
    }
}
