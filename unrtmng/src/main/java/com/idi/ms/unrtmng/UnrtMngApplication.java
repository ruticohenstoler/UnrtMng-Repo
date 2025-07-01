package com.idi.ms.unrtmng;

import com.idi.plugin.IdiPluginAutoConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ImportAutoConfiguration(IdiPluginAutoConfiguration.class)
@ComponentScan("com.idi")
public class UnrtMngApplication {

	public static void main(String[] args) {
		SpringApplication.run(UnrtMngApplication.class, args);
	}
}
