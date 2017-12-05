/*
 * Copyright (C) 2014 DBC A/S (http://dbc.dk/)
 *
 * This is part of solr-cloud-indexer
 *
 * Solr-cloud-indexer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Solr-cloud-indexer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dbc.cloud.worker;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Properties;
import javax.annotation.Resource;
import javax.ejb.EJBException;
import javax.ejb.Singleton;
import javax.enterprise.inject.Produces;
import javax.enterprise.inject.spi.Annotated;
import javax.enterprise.inject.spi.InjectionPoint;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author DBC {@literal <dbc.dk>}
 */
@Singleton
public class EEConfig {

    private static final Logger log = LoggerFactory.getLogger(EEConfig.class);

    @Target(value = {ElementType.FIELD})
    @Retention(value = RetentionPolicy.RUNTIME)
    public @interface Name {

        String value();
    }

    @Target(value = {ElementType.FIELD})
    @Retention(value = RetentionPolicy.RUNTIME)
    public @interface Url {

        boolean authentication() default false;
    }

    @Target(value = {ElementType.FIELD})
    @Retention(value = RetentionPolicy.RUNTIME)
    public @interface Default {

        String value();
    }

    @Resource(lookup = "solr-worker")
    private Properties props;

    @Produces
    public String getString(InjectionPoint ip) {
        String value = getValue(ip);
        Annotated annotated = ip.getAnnotated();
        Min min = annotated.getAnnotation(Min.class);
        if (min != null && value.length() < min.value()) {
            throw new EJBException("value length of " + value + " for: " + getName(ip) + " is out of range");
        }
        Max max = annotated.getAnnotation(Max.class);
        if (max != null && value.length() > max.value()) {
            throw new EJBException("value lenght of " + value + " for: " + getName(ip) + " is out of range");
        }
        Url url = ip.getAnnotated().getAnnotation(Url.class);
        if (url != null) {
            try {
                URL u = new URL(value);
                if (url.authentication() && u.getUserInfo() == null) {
                    throw new EJBException("value of " + value + " for: " + getName(ip) + " does not contain authentication");
                }
            } catch (MalformedURLException ex) {
                throw new EJBException("value of " + value + " for: " + getName(ip) + " is not a URL");
            }
        }
        return value;
    }

    @Produces
    public boolean getBoolean(InjectionPoint ip) {
        String value = getValue(ip);
        if (value == null) {
            throw new EJBException("Cannot resolve value for: " + getName(ip) + " null is not allowed");
        }
        if ("true".equals(value)) {
            return true;
        }
        if ("false".equals(value)) {
            return false;
        }
        throw new EJBException("Cannot resolve value for: " + getName(ip) + " should be true/false");
    }

    @Produces
    public int getInt(InjectionPoint ip) {
        return (int) getLong(ip);
    }

    @Produces
    public long getLong(InjectionPoint ip) {
        long value = Long.parseLong(getValue(ip));
        Annotated annotated = ip.getAnnotated();
        Min min = annotated.getAnnotation(Min.class);
        if (min != null && value < min.value()) {
            throw new EJBException("value of " + value + " for: " + getName(ip) + " is out of range");
        }
        Max max = annotated.getAnnotation(Max.class);
        if (max != null && value > max.value()) {
            throw new EJBException("value of " + value + " for: " + getName(ip) + " is out of range");
        }
        return value;
    }

    @Produces
    public URL getURL(InjectionPoint ip) {
        String value = getValue(ip);
        try {
            return new URL(value);
        } catch (MalformedURLException ex) {
            throw new EJBException("value of " + value + " for: " + getName(ip) + " is not a URL");
        }
    }

    private String getValue(InjectionPoint ip) throws EJBException {
        String name = getName(ip);
        String value = props.getProperty(name);
        if (value == null) {
            Default def = ip.getAnnotated().getAnnotation(Default.class);
            if (def != null) {
                value = def.value();
            }
        }
        NotNull notNull = ip.getAnnotated().getAnnotation(NotNull.class);
        if (notNull != null && value == null) {
            throw new EJBException("Cannot resolve value for: " + name + " null is not allowed");
        }
        log.info("Configuration value {}:{}", name, value);
        return value;
    }

    private String getName(InjectionPoint ip) {
        String name;
        Name annotatedName = ip.getAnnotated().getAnnotation(Name.class);
        if (annotatedName != null) {
            name = annotatedName.value();
        } else {
            name = ip.getMember().getName();
        }
        return name;
    }
}
