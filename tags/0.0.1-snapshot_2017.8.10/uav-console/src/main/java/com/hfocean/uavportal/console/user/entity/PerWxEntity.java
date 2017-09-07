package com.hfocean.uavportal.console.user.entity;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

/**
 * @author guan.sj
 */
@Entity
@Table(name="tb_user_wx")
public class PerWxEntity  implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    private String id;//微信open_id
    @OneToOne
    @JoinColumn(name = "userId")
    private UserPersonalEntity user;
    
    private Integer type;
    
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public UserPersonalEntity getUser() {
		return user;
	}

	public void setUser(UserPersonalEntity user) {
		this.user = user;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}
    
    
}