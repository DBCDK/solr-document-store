/*
 * Copyright (C) 2021 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-doc-store-updater
 *
 * solr-doc-store-updater is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * solr-doc-store-updater is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.search.solrdocstore.updater;

import dk.dbc.solrdocstore.updater.businesslogic.VipCoreLibraryRule;

/**
 *
 * @author Morten Bøgeskov (mb@dbc.dk)
 */
public class VipCoreLibraryRuleMockResponse extends VipCoreLibraryRule {

    private final boolean authCreateComonRecord;
    private final boolean isFbsLibrary;
    private final boolean isPartOfDanbib;
    private final boolean isPartOfBibdk;
    private final boolean isResearchLibrary;
    private final boolean usesHoldingsItem;

    public VipCoreLibraryRuleMockResponse(boolean authCreateComonRecord, boolean isFbsLibrary, boolean isPartOfDanbib, boolean isPartOfBibdk, boolean isResearchLibrary, boolean usesHoldingsItem) {
        this.authCreateComonRecord = authCreateComonRecord;
        this.isFbsLibrary = isFbsLibrary;
        this.isPartOfDanbib = isPartOfDanbib;
        this.isPartOfBibdk = isPartOfBibdk;
        this.isResearchLibrary = isResearchLibrary;
        this.usesHoldingsItem = usesHoldingsItem;
    }

    @Override
    public boolean isFbsLibrary() {
        return isFbsLibrary;
    }

    @Override
    public boolean isResearchLibrary() {
        return isResearchLibrary;
    }

    @Override
    public boolean isPartOfDanbib() {
        return isPartOfDanbib;
    }

    @Override
    public boolean isPartOfBibdk() {
        return isPartOfBibdk;
    }

    @Override
    public boolean usesHoldingsItem() {
        return usesHoldingsItem;
    }

    @Override
    public boolean authCreateCommonRecord() {
        return authCreateComonRecord;
    }

}
